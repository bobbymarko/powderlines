window.onload = function() {
  var domain = "http://api.powderlin.es";

  var tileServer = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
  var tileAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>';
  var maxZoom = 18;
  var map = L.map('map', {
    center: [39.8282, -98.5795],
    zoom: 4,
    scrollWheelZoom: false
  });
  
  //https://github.com/leaflet-extras/leaflet-providers
  L.tileLayer(tileServer, {
    attribution: tileAttribution,
    maxZoom: maxZoom
  }).addTo(map);

  $.ajax({
    url: domain + '/stations',
    jsonp: "callback",
    dataType: "jsonp",
    success: function(data) {
      $.each(data, function(index, station) {
        var lat = station.location.lat,
            lng = station.location.lng,
            latlng = L.latLng(lat, lng);
        var marker = L.marker(latlng);
        setTimeout(function() {
          marker.addTo(map);
          var popupContent = "<h6>" + station.name + "</h6>" + "Elevation: " + station.elevation + "ft<br>" + "Triplet: " + station.triplet;
          marker.bindPopup(popupContent);
          marker.on('click', function() {
            graph(station.triplet);
          });
        }, index * 200);
      });
    }
  });

  var graph = function(triplet) {
    $('#graph .placeholder-rectangle').html('Loading&hellip;');

    var
      d1 = [],
      options,
      graph,
      container = document.getElementById("graph"),
      o;
    
    $.ajax({
      url: domain + '/station/' + triplet,
      jsonp: "callback",
      dataType: "jsonp",
      data: {
        days: 100
      },
      success: function(data) {
        var maxSnow = 0;
        var margin = 2;
        $.each(data.data, function() {
          d1.push([new Date(this["Date"]).getTime(), this["Snow Depth (in)"]]);
          if (this["Snow Depth (in)"] > maxSnow) {
            maxSnow = parseFloat(this["Snow Depth (in)"], 10);
          }
          graph = drawGraph( { yaxis : {max: maxSnow + margin} } ); 
        })
      }
    });
          
    options = {
      shadowSize: 0,
      lines : { fill : true, show: false, lineWidth: 0, color: '#ccc', fillColor:'#ccc' },
      xaxis : {
        mode : 'time', 
        labelsAngle : 45
      },
      yaxis : {
        min: 0,
        max: 200
      },
      selection : {
        mode : 'x'
      },
      HtmlText : false,
      title : 'Snow Depth (in)'
    };
          
    // Draw graph with default options, overwriting with passed options
    function drawGraph (opts) {
  
      // Clone the options, so the 'options' variable always keeps intact.
      o = Flotr._.extend(Flotr._.clone(options), opts || {});
  
      // Return a new graph.
      return Flotr.draw(
        container,
        [ d1 ],
        o
      );
    }
  
         
          
    Flotr.EventAdapter.observe(container, 'flotr:select', function(area){
      // Draw selected area
      graph = drawGraph({
        xaxis : { min : area.x1, max : area.x2, mode : 'time', labelsAngle : 45 },
        yaxis : { min : area.y1, max : area.y2 }
      });
    });
          
    // When graph is clicked, draw the graph with default area.
    Flotr.EventAdapter.observe(container, 'flotr:click', function () { graph = drawGraph(); });
  }
}