$(function() {
  $('.mapped').each(function() {
    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lon = $this.attr('data-long');
    var $gpx = $('.gpx-file');
    var colors = ['red','blue','yellow','lime'];
    //var tileServer = 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png';
    //var tileServer = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    //var tileServer = 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg';
    var tileServer = 'http://s3-us-west-1.amazonaws.com/ctusfs/fstopo/{z}/{x}/{y}.png';
    var tileAttribution = '';
    var maxZoom = 18;
    var map = L.map($this[0], {
        center: [lat, lon],
        zoom: 13,
        scrollWheelZoom: false
    });
    
    //https://github.com/leaflet-extras/leaflet-providers
    L.tileLayer(tileServer, {
        attribution: tileAttribution,
        maxZoom: maxZoom
    }).addTo(map);
    
    function select($el) {
      classIt($el, 'select');
    }
    
    function hover($el) {
      classIt($el, 'hover');
    }
    
    function classIt($el, cssClass) {
      $el.addClass(cssClass).closest('li').siblings().find('.' + cssClass).removeClass(cssClass);
    }
    
    function highlightPath(gpx) {
      //console.log(gpx);
      $.each(gpx._layers, function() {
        this.setStyle({
            color: '#fff',
            opacity: 1
        }).bringToFront();
      });
    }
    
    //https://github.com/mpetazzoni/leaflet-gpx
    $.getScript('/assets/scripts/gpx.js', function() {
      $gpx.each(function() {
        var $this = $(this);
        var path = new L.GPX($this.attr('data-gpx'), {
          async: true,
          polyline_options: {
            color: colors[Math.floor(Math.random() * colors.length)],
            weight: 2
          },
          marker_options: {
            startIconUrl: null, //'/assets/img/pin-icon-start.png',
            endIconUrl: null, //'/assets/img/pin-icon-end.png',
            shadowUrl: null //'/assets/img/pin-shadow.png'
          }
        }).on('loaded', function(e) {
          map.fitBounds(e.target.getBounds());
        // interact with a line on the map
        }).on('click', function(e) {
          select($this);
          highlightPath(e.target);
        }).on('mouseover', function(e) {
          hover($this);
        }).on('mouseout', function(e) {
        
        }).addTo(map);
        
        //clicking one of the boxes in the sidebar
        $this.on('click', function() {
          //console.log(path);
          select($this);
          highlightPath(path);
        }).on('mouseover', function(e) {
          hover($this);
        });
      });
    });
  });
});