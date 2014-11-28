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
  var polylineWidth = 2;
  var normalColor = Cesium.Color.YELLOW;
  var highlightColor = new Cesium.Color(1.0, 0.5, 0.0, 1.0);
  var minDistance = 0;
  var maxDistance = 9999999;
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
  var primitives = viewer.scene.primitives;
  var camera = viewer.scene.camera;
  
  // how do i detect clicks on my polylines?
  Cesium.knockout.getObservable(viewer, 'selectedEntity').subscribe(function(entity) {
      if (entity !== undefined) {
        //todo - add prefix to id
        $('#' + entity.id).trigger('click');
      }
  });
  
  
  var dataSource = new Cesium.GeoJsonDataSource();
  dataSource.loadUrl('/assets/gpx/ski-tours-complete.geojson').then(function() {
    var entities = dataSource.entities.entities;
    knockItOut(); // we can do the knockout stuff now that the json data has loaded
  }).otherwise(function(error) {
    alert('Tours could not be found. Please reload the page.');
  });
  viewer.dataSources.add(dataSource);
  
  camera.lookAt(Cesium.Cartesian3.fromDegrees(-121.81263, 45, 300000),
  Cesium.Cartesian3.fromDegrees(-121.81263, 48.706652, 0), Cesium.Cartesian3.UNIT_Z);
  
  /* Knockout stuff */
  var knockItOut = function() {
    // show the scroller
    $('.left-panel').removeClass('loading');
    
    function Tour(data) {
      this.id = ko.observable(data.id);
      this.name = ko.observable(data.name);
      this.description = ko.observable(data.description);
      this.distance = ko.observable(data.distance);
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
              entity.polyline.material = Cesium.ColorMaterialProperty.fromColor(normalColor);
            }
            if (entity.polygon) {
              entity.polygon.material = Cesium.ColorMaterialProperty.fromColor(normalColor);
            }
          }
          
          if (cesiumTour.polyline) {
            var positions = cesiumTour.polyline.positions.getValue(new Cesium.JulianDate.now());
            cesiumTour.polyline.material = Cesium.ColorMaterialProperty.fromColor(highlightColor);
          } else {
            var positions = cesiumTour.polygon.positions.getValue(new Cesium.JulianDate.now());
            cesiumTour.polygon.material = Cesium.ColorMaterialProperty.fromColor(highlightColor);
          }
          
          // convert the positions to something we can work with
          positions = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(positions);
          
          // Create a bounding box for the camera to zoom to
          var west, south, east, north;
          for (var i = 0; i < positions.length; i++) {
            var position = positions[i];
            if (typeof west === 'undefined' || position.longitude < west) {
              west = position.longitude
            }
            if (typeof south === 'undefined' || position.latitude < south) {
              south = position.latitude
            }
            if (typeof east === 'undefined' || position.longitude > east) {
              east = position.longitude
            }
            if (typeof north === 'undefined' || position.latitude > north) {
              north = position.latitude
            } 
          }
          
          camera.flyToRectangle({
            destination : new Cesium.Rectangle(west, south, east, north),
            complete : function() {
              // fine tune view here
              camera.zoomOut(8000.0);
            }
          });
        }
     
        var mappedTours = $.map(dataSource.entities.entities, function(entity) {
          return new Tour({
            id: entity.id,
            name: entity.name,
            description: entity.properties.description,
            distance: entity.properties.distance
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