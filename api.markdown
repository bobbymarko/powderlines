---
layout: page
title: API
page_title: API
image: api.jpg
header-class: dark-image
---

Use our free API for accessing SNOTEL station data. Our API is useful for finding current snow levels in mountainous regions across the United States. All endpoints accept a callback parameter for JSONP and don't require authentication.

Over 800 SNOTEL stations are available:

<div id="map" style="width:100%;height:400px;"></div>
<div id="graph" style="width:100%;height:200px">Select a station above to see snow levels over time</div>


Fetch all stations
------------------
Endpoint
<code><a href="http://api.powderlin.es/stations">http://api.powderlin.es/stations</a></code>

Fetch snow info for a particular station
----------------------------------------
Endpoint
<code><a href="http://api.powderlin.es/station/791:WA:SNTL?days=20">http://api.powderlin.es/station/791:WA:SNTL?days=20</a></code>

Parameters
<table>
  <tr>
    <th>Parameter</th>
    <th>Descriptions</th>
  </tr>
  <tr>
    <td>triplet</td>
    <td>Station id in the form of ###:STATE:SNTL. Example: 791:WA:SNTL. Find the triplet for a particular station through the /stations endpoint.</td>
  </tr>
  <tr>
    <td>days (integer)</td>
    <td>Number of days information to retrieve from today.</td>
  </tr>
</table>


Find closest station to a particular lat/long:
----------------------------------------------
<code><a href="http://api.powderlin.es/closest_stations?lat=47.3974&lng=-121.3958&data=true&days=3&count=3">http://api.powderlin.es/closest_stations?lat=47.3974&lng=-121.3958&data=true&days=3&count=3</a></code>

Parameters
<table>
  <tr>
    <th>Parameter</th>
    <th>Descriptions</th>
  </tr>
  <tr>
    <td>lat (float)</td>
    <td>Latitude to base search off of. (required)</td>
  </tr>
  <tr>
    <td>lng (float)</td>
    <td>Longitude to base search off of. (required)</td>
  </tr>
  <tr>
    <td>data (boolean)</td>
    <td>Setting to true will enable fetching of snow info from the stations. Note that this might be slow depending on the number of stations you're requesting information from.</td>
  <tr>
  <tr>
    <td>days (integer)</td>
    <td>Number of days information to retrieve from today.</td>
  </tr>
  <tr>
    <td>count (integer)</td>
    <td>number of station's to return (defaults to 3, maximum of 5)</td>
  </tr>
</table>


Want to help out?
-----------------

The source for the API is available at <a href="https://github.com/bobbymarko/powderlines-api">https://github.com/bobbymarko/powderlines-api</a>.

To run locally - clone the repo, run "bundle install", run 'rackup', navigate to http://localhost:9292

<script src="/assets/js/flotr2.js"></script>
<script>
window.onload = function() {
//  $(function() { 
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
          }, index * 1000);
        });
      }
    });

    
    var graph = function(triplet) {
    
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
          $.each(data.data, function() {
            d1.push([new Date(this["Date"]).getTime(), this["Snow Depth (in)"]]);
            graph = drawGraph(); 
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
    
//  });
}
</script>