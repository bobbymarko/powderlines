$(function() {
  $('.mapped').each(function() {
    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lon = $this.attr('data-long');
    var $gpx = $('.gpx-file');
    var colors = ['red','blue','yellow','lime'];
    var tileServer = 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png';
    var tileServer = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    //var tileServer = 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg';
    var tileAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
    var maxZoom = 18;
    var map = L.map($this[0], {
        center: [lat, lon],
        zoom: 13
    });
    
    //https://github.com/leaflet-extras/leaflet-providers
    L.tileLayer(tileServer, {
        attribution: tileAttribution,
        maxZoom: maxZoom
    }).addTo(map);
    
    //https://github.com/mpetazzoni/leaflet-gpx
    $.getScript('/assets/scripts/gpx.js', function() {
      $gpx.each(function() {
        var path = new L.GPX($(this).attr('href'), {
          async: true,
          polyline_options: {
            color: colors[Math.floor(Math.random() * colors.length)]
          },
          marker_options: {
            startIconUrl: '/assets/img/pin-icon-start.png',
            endIconUrl: '/assets/img/pin-icon-end.png',
            shadowUrl: '/assets/img/pin-shadow.png'
          }
        }).on('loaded', function(e) {
          map.fitBounds(e.target.getBounds());
        }).on('click', function(e) {
          //console.log(e);
        }).addTo(map);
      });
    });
  });
});