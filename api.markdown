---
layout: page
title: API
page_title: API
image: api.jpg
header-class: dark-image
---

Use our free API for accessing SNOTEL station data. Our API is useful for finding current snow levels in mountainous regions across the United States. All endpoints accept a callback parameter for JSONP and don't require authentication.

Over 800 SNOTEL stations are available:

<div id="map"></div>
<div id="graph-wrapper">
  <div id="graph" style="height:200px">
    <div class="placeholder-rectangle">Select a station above to see snow levels here</div>
  </div>
</div>

Get all SNOTEL stations
------------------
**Description:**<br>
Returns basic information about all of the SNOTEL stations in the United States.

**Endpoint:** /stations

**Request parameters:**
<table>
  <tr>
    <th>Parameter</th>
    <th>Descriptions</th>
  </tr>
  <tr>
    <td>None</td>
    <td>None</td>
  </tr>
</table>

**Response parameters:**<br>
The response comes as an array of objects. Here is a breakdown of a returned object.

<table>
  <tr>
    <th>Parameter</th>
    <th>Descriptions</th>
  </tr>
  <tr>
    <td>Elevation (integer)</td>
    <td>Elevation of the station in feet</td>
  </tr>
  <tr>
    <td>Location (lat, lng object)</td>
    <td>Latitude and longitude of the station</td>
  </tr>
  <tr>
    <td>Name (string)</td>
    <td>Name of the station in ALL CAPS</td>
  </tr>
  <tr>
    <td>Triplet (string)</td>
    <td>Unique identifier for the station. Formatted as <ID number>:<state code>:SNTL</td>
  </tr>
  <tr>
    <td>Wind (boolean)</td>
    <td>Indiciates whether or not the station is equiped with a wind sensor</td>
  </tr>
</table>

**Sample call:** <a href="http://api.powderlin.es/stations">http://api.powderlin.es/stations</a>

**Sample response:**
<pre>
[
    {
        "elevation":8777,
        "location": {"lat":40.8852,"lng":-110.8277},
        "name":"BEAR RIVER RS",
        "timezone":-7,
        "triplet":"992:UT:SNTL",
        "wind":false
    },
    {
        "elevation":5130,
        "location":{"lat":46.78265,"lng":-121.74765},
        "name":"PARADISE",
        "timezone":-8,
        "triplet":"679:WA:SNTL",
        "wind":false
    },
    {
        ...
    }
]
</pre>

Get snow info for a station
---------------------------
**Description:**<br>
Returns detailed information for the specified SNOTEL station.

**Endpoint:** /station/:id

**Request parameters:**
<table>
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>ID (triplet)</td>
    <td>Station id in the form of ###:STATE:SNTL. Example: 791:WA:SNTL. Find the triplet for a particular station through the /stations endpoint.</td>
  </tr>
  <tr>
    <td>Days (integer)</td>
    <td>Number of days information to retrieve from today.</td>
  </tr>
</table>

**Response parameters:**<br>
The response includes basic station information in addition to an array of snow data.
<table>
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Date</td>
    <td>Date measurement was taken</td>
  </tr>
  <tr>
    <td>Snow Water Equivalent (in)</td>
    <td>The amount of water contained within the snowpack.</td>
  </tr>
  <tr>
    <td>Change In Snow Water Equivalent (in)</td>
    <td>The change in the snow water equivalent from the last measurement (typically the past 24 hours).</td>
  </tr>
  <tr>
    <td>Snow Depth (in)</td>
    <td>Depth of snow in inches.</td>
  </tr>
  <tr>
    <td>Change In Snow Depth (in)</td>
    <td>The change in the snow depth from the last measurement (typically the past 24 hours).</td>
  </tr>
</table>

**Sample call:** <a href="http://api.powderlin.es/station/791:WA:SNTL?days=20">http://api.powderlin.es/station/791:WA:SNTL?days=20</a>

**Sample response:**
<pre>
{
    "station_information":
        {
            "elevation":3950,
            "location": {"lat":47.74607,"lng":-121.09288},
            "name":"STEVENS PASS",
            "timezone":-8,
            "triplet":"791:WA:SNTL",
            "wind":false
        },
    "data": [
        {
            "Date":"2014-06-30",
            "Snow Water Equivalent (in)":"0.0",
            "Change In Snow Water Equivalent (in)":"0.0",
            "Snow Depth (in)":"0",
            "Change In Snow Depth (in)":"0"
        },
        {
            "Date":"2014-07-01",
            "Snow Water Equivalent (in)":"0.0",
            "Change In Snow Water Equivalent (in)":"0.0",
            "Snow Depth (in)":"0",
            "Change In Snow Depth (in)":"0"
        },
        {
            ...
        }
    ]   
}
</pre>

Find closest station to a latitude and longitude:
-------------------------------------------------
**Description:**<br>
Returns detailed information for the closest SNOTEL stations to a geographic point.

**Endpoint:** /closest_stations

**Request parameters:**
<table>
  <tr>
    <th>Parameter</th>
    <th>Description</th>
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

**Response parameters:**<br>
The response is an array of stations including their basic information in addition to an array of snow data.
<table>
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Date</td>
    <td>Date measurement was taken</td>
  </tr>
  <tr>
    <td>Snow Water Equivalent (in)</td>
    <td>The amount of water contained within the snowpack.</td>
  </tr>
  <tr>
    <td>Change In Snow Water Equivalent (in)</td>
    <td>The change in the snow water equivalent from the last measurement (typically the past 24 hours).</td>
  </tr>
  <tr>
    <td>Snow Depth (in)</td>
    <td>Depth of snow in inches.</td>
  </tr>
  <tr>
    <td>Change In Snow Depth (in)</td>
    <td>The change in the snow depth from the last measurement (typically the past 24 hours).</td>
  </tr>
</table>

**Sample call:** <a href="http://api.powderlin.es/closest_stations?lat=47.3974&lng=-121.3958&data=true&days=3&count=3">http://api.powderlin.es/closest_stations?lat=47.3974&lng=-121.3958&data=true&days=3&count=3</a>

**Sample response:**
<pre>
[
    {
        "station_information":
            {
                "elevation":3950,
                "location": {"lat":47.74607,"lng":-121.09288},
                "name":"STEVENS PASS",
                "timezone":-8,
                "triplet":"791:WA:SNTL",
                "wind":false
            },
        "data": [
            {
                "Date":"2014-06-30",
                "Snow Water Equivalent (in)":"0.0",
                "Change In Snow Water Equivalent (in)":"0.0",
                "Snow Depth (in)":"0",
                "Change In Snow Depth (in)":"0"
            },
            {
                "Date":"2014-07-01",
                "Snow Water Equivalent (in)":"0.0",
                "Change In Snow Water Equivalent (in)":"0.0",
                "Snow Depth (in)":"0",
                "Change In Snow Depth (in)":"0"
            },
            {
                ...
            }
        ]   
    },
    {
        ...
    }
]
</pre>

Want to help out?
-----------------

The source for the API is available at <a href="https://github.com/bobbymarko/powderlines-api">https://github.com/bobbymarko/powderlines-api</a>.

To run the API locally:
1. Clone the git repository
2. Run "bundle install"
3. Run 'rackup'
4. Navigate to http://localhost:9292 in your browser


Feedback
-----------------

Let us know if you have any questions or concern. <a href="mailto:bobby@powderlin.es">Email Bobby</a>

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
    
//  });
}
</script>