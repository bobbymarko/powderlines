//$.getScript(url, successCallback)

$(function() {
  
  /* Adjust scroll pane height */
  var $scroller = $('.scroller');
  var $navBar = $('.nav-bar');
  var $footer = $('.map-footer');
  var scrollerAdjust = function() {
    var height = $(window).height() - $navBar.outerHeight() - $footer.outerHeight();
    $scroller.css('height', height + 'px');
  }
  scrollerAdjust();
  $(window).smartresize(function() {
    scrollerAdjust();
  });
  
  
  /* Housekeeping */
  var polylineWidth = 3;
  var normalStrokeColor = Cesium.Color.YELLOW;
  var highlightStrokeColor = new Cesium.Color(1.0, 0.5, 0.0, 1.0);
  var minDistance = 0;
  var maxDistance = 9999999;
  var offsetZ = 5000
  var offsetBack = 18000;
  var $scroller = $(".left-panel .scroller");
  ko = Cesium.knockout;
  
  /* Main Cesium */
  Cesium.BingMapsApi.defaultKey = "AgRxdroanFbgogMNQ3HpvADZ2txGKmu1cTTRqlrAUSFLfbP38ZhuYKBSY1ZK0aHl";
  var viewer = new Cesium.Viewer('cesiumContainer', {
    animation       : false,
    homeButton      : false,
    timeline        : false,
    sceneModePicker : false,
    baseLayerPicker : false,
    fullscreenButton: false,
    navigationHelpButton : false,
    geocoder        : false,
    infoBox         : false,
    terrainProvider : new Cesium.CesiumTerrainProvider({
        url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles',
        credit : 'Routes plotted by <a href="http://erikhenne.com">Erik Henne</a>'
    })
  });
  viewer.extend(Cesium.viewerEntityMixin);
  //viewer.scene.globe.depthTestAgainstTerrain = true;
  
  // Create a polyline collection with two polylines
  var scene = viewer.scene;
  var primitives = scene.primitives;
  var camera = scene.camera;
  
  // Camera debugger
  /*
  viewer.clock.onTick.addEventListener(function(clock) {
      console.log(camera.up, camera.direction);
  });
  */
  
  // how do i detect clicks on my polylines?
  Cesium.knockout.getObservable(viewer, 'selectedEntity').subscribe(function(entity) {
      if (entity !== undefined) {
        //todo - add prefix to id
        $('#' + entity.id).trigger('click');
      }
  }); 
  
  var dataSource = new Cesium.GeoJsonDataSource();
  dataSource.loadUrl('/assets/gpx/ski-tours-complete.geojson', {
    stroke: normalStrokeColor,
    fill: Cesium.Color.PINK,
    strokeWidth: polylineWidth,
    markerSymbol: '?'
  }).then(function() {
    var entities = dataSource.entities.entities;
    knockItOut(); // we can do the knockout stuff now that the json data has loaded
  }).otherwise(function(error) {
    alert('Tours could not be found. Please reload the page.');
  });
  viewer.dataSources.add(dataSource);
  
  camera.lookAt(Cesium.Cartesian3.fromDegrees(-121.81263, 44, 200000),
  Cesium.Cartesian3.fromDegrees(-121.81263, 48.706652, 0), Cesium.Cartesian3.UNIT_Z);
  
  var ellipsoid = scene.globe.ellipsoid;
  var labels = scene.primitives.add(new Cesium.LabelCollection());
  label = labels.add();
  var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function(movement) {
    var picked = scene.pick(movement.endPosition);
    var cartesian = scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);    
    if (cartesian && picked && picked.id && picked.id.properties) {
      label.show = true;
      label.text = picked.id.properties.name;
      label.position = cartesian;
      label.font = "1.2rem pt_sans, 'Helvetica Neue', arial, sans-serif";
      label.outlineWidth = 0;
      label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
      label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
      $('#' + picked.id.id).addClass('hover');
    } else {
      label.show = false;
      $('.left-panel .hover').removeClass('hover')
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  
  /* Knockout stuff */
  var knockItOut = function() {
    // show the scroller
    $('.left-panel').removeClass('loading');
    
    function Tour(data) {
      this.id = ko.observable(data.id);
      this.name = ko.observable(data.name);
      this.description = ko.observable(data.description);
      this.distance = ko.observable(data.distance);
      this.link = ko.observable(data.link);
      this.formattedDistance = ko.computed(function() {
        if (this.distance()) {
          return this.distance() + 'mi';
        }
      }, this);
    }
    
    function TourListViewModel() {
        // Data
        var self = this;
        self.tours = ko.observableArray([]);
        self.query = ko.observable('');
        self.minDistanceQuery = ko.observable('');
        self.maxDistanceQuery = ko.observable('');
        
        self.filteredTours = ko.computed(function() {
          var query = this.query().toLowerCase(),
              minDistanceQuery = this.minDistanceQuery() || minDistance,
              maxDistanceQuery = this.maxDistanceQuery() || maxDistance;
          if (!query && minDistanceQuery == minDistance && maxDistanceQuery == maxDistance) {
            return this.tours();
          } else {
            return ko.utils.arrayFilter(this.tours(), function (tour) {
                if (!query) {
                  return (tour.distance() >= minDistanceQuery) && (tour.distance() <= maxDistanceQuery);
                } else {
                  return (tour.name().toLowerCase().indexOf(query) !== -1) && (tour.distance() >= minDistanceQuery) && (tour.distance() <= maxDistanceQuery);
                }
            });
          }
        }, self);
        
        self.tourMouseOver = function(data, tour) {
          //$('#' + tour.id()).addClass('hover');
        }
        
        self.tourMouseOut = function(data, tour) {
          //$('#' + tour.id()).removeClass('hover');
        }
        
        self.tourClick = function(data, tour) {
          var cesiumTour = dataSource.entities.getById(tour.id());
          var $listTour = $('#' + tour.id());
          
          //scroll tour into view
          var scrollTo = $listTour.position().top;
          // check if item is in view of the scroll pane.
          if (scrollTo > $scroller.scrollTop() + $scroller.height() || scrollTo < $scroller.scrollTop()) {
            $scroller.animate({ scrollTop: scrollTo }, 2000);
          }
          $listTour.addClass('selected').siblings().removeClass('selected');
          
          // reset colors
          var entities = dataSource.entities.entities;
          for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.polyline) {
              entity.polyline.material = Cesium.ColorMaterialProperty.fromColor(normalStrokeColor);
            }
            if (entity.polygon) {
              entity.polygon.material = Cesium.ColorMaterialProperty.fromColor(normalStrokeColor);
            }
          }
          
          if (cesiumTour.polyline) {
            var positions = cesiumTour.polyline.positions.getValue(new Cesium.JulianDate.now());
            cesiumTour.polyline.material = Cesium.ColorMaterialProperty.fromColor(highlightStrokeColor);
          } else {
            var positions = cesiumTour.polygon.positions.getValue(new Cesium.JulianDate.now());
            cesiumTour.polygon.material = Cesium.ColorMaterialProperty.fromColor(highlightStrokeColor);
          }
          
          // convert the positions to something we can work with
          positions = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(positions);
          
          var boundingBox = Cesium.Rectangle.fromCartographicArray(positions),
              boundingBoxCenter = Cesium.Rectangle.center(boundingBox);
          
          // Get tallest point
          var minHeight, maxHeight;
          for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            if (typeof minHeight === 'undefined' || position.height > minHeight) {
              minHeight = position.height
            }
            if (typeof maxHeight === 'undefined' || position.height < maxHeight) {
              maxHeight = position.height
            }
          }
          // set the average height
          boundingBoxCenter.height = ((minHeight + maxHeight) / 2) + offsetZ;
          
          // debugging rectangle
          /*viewer.scene.primitives.add(new Cesium.RectanglePrimitive({
              rectangle : boundingBox,
              height : boundingBoxCenter.height
          }));*/
          
          var boundingBoxCenterCartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(boundingBoxCenter);
          
          camera.flyTo({
            destination: boundingBoxCenterCartesian
          });
          
          return true; // disabled prevent default
        }
     
        var mappedTours = $.map(dataSource.entities.entities, function(entity) {
          return new Tour({
            id: entity.id,
            name: entity.name,
            description: entity.properties.description,
            distance: entity.properties.distance,
            link: entity.properties.link
          })
        });
        self.tours(mappedTours);
        
        self.filteredTours.subscribe(function(tours) {
          // hide all tours
          var entities = dataSource.entities.entities;
          for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.polyline) {
              entity.polyline.show = new Cesium.ConstantProperty(false);
            }
            if (entity.polygon) {
              entity.polygon.show = new Cesium.ConstantProperty(false);
            }
          }
          
          $.each(tours, function() {
            var tour = this;
            // show the ones that match
            var tourGeometry = dataSource.entities.getById(tour.id());
            if (tourGeometry.polyline) {
              tourGeometry.polyline.show = new Cesium.ConstantProperty(true); 
            }
            if (tourGeometry.polygon) {
              tourGeometry.polygon.show = new Cesium.ConstantProperty(true); 
            }
          });
          
        });
    }
  
    ko.applyBindings(new TourListViewModel(), document.getElementById('tour-filter-form'));
  }
});