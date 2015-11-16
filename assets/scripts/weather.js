// capture weather info for gps point from weather.gov
$(function(){
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ];
  
  var days = [
    'Sun',
    'Mon',
    'Tues',
    'Wed',
    'Thurs',
    'Fri',
    'Sat'
  ];

  var icons = {
    "bkn": "CLOUDY",
    "nbkn": "CLOUDY",
    "skc": "CLEAR_DAY",
    "nskc": "CLEAR_NIGHT",
    "few": "PARTLY_CLOUDY_DAY",
    "nfew": "PARTLY_CLOUDY_NIGHT",
    "sct": "PARTLY_CLOUDY_DAY",
    "nsct": "PARTLY_CLOUDY_NIGHT",
    "ovc": "CLOUDY",
    "novc": "CLOUDY",
    "fg": "FOG",
    "nfg": "FOG",
    "smoke": "FOG",
    "fzra": "SLEET",
    "ip": "SLEET",
    "mix": "SLEET",
    "nmix": "SLEET",
    "raip": "SLEET",
    "rasn": "SLEET",
    "nrasn": "SLEET",
    "shra": "RAIN",
    "tsra": "RAIN",
    "ntsra": "RAIN",
    "sn": "SNOW",
    "nsn": "SNOW",
    "wind": "WIND",
    "nwind": "WIND",
    "hi_shwrs": "RAIN",
    "hi_nshwrs": "RAIN",
    "fzrara": "SLEET",
    "hi_tsra": "RAIN",
    "hi_ntsra": "RAIN",
    "ra1": "RAIN",
    "nra": "RAIN",
    "ra": "RAIN",
    "nra": "RAIN",
    "nsvrtsra": "WIND",
    "dust": "FOG",
    "mist": "FOG",
    "cold": "FOG"
  };
  
  $('.avalanche-info').each(function() {
    var $this = $(this);
    var tour_zone = $this.attr('data-zone');
    var url = 'http://www.nwac.us/api/v2/avalanche-forecast/?limit=1&callback=?';
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        $.each(data.objects[0].avalanche_region_forecast, function() {
          var forecast = this;
          $.each(this.zones, function() {
            var zone = this;
            if (zone.slug == tour_zone) {
              var day1_day = new Date(forecast.day1_date + ' PST');
              var day1_danger_elev_high = forecast.day1_danger_elev_high;
              var day1_danger_elev_middle = forecast.day1_danger_elev_middle;
              var day1_danger_elev_low = forecast.day1_danger_elev_low;

              $this.find('.day1_day').text(days[day1_day.getDay()]);
              $this.find('.day1_danger_elev_high').text(day1_danger_elev_high);
              $this.find('.day1_danger_elev_middle').text(day1_danger_elev_middle);
              $this.find('.day1_danger_elev_low').text(day1_danger_elev_low);

              var day2_day = new Date(day1_day.setDate(day1_day.getDate()+1));
              var day2_danger_elev_high = forecast.day2_danger_elev_high;
              var day2_danger_elev_middle = forecast.day2_danger_elev_middle;
              var day2_danger_elev_low = forecast.day2_danger_elev_low;

              $this.find('.day2_day').text(days[day2_day.getDay()]);
              $this.find('.day2_danger_elev_high').text(day2_danger_elev_high);
              $this.find('.day2_danger_elev_middle').text(day2_danger_elev_middle);
              $this.find('.day2_danger_elev_low').text(day2_danger_elev_low);
              
              return
            }
          });
        });
      }
    });
  });
  
  $('.snotel').each(function() {
    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lon = $this.attr('data-long');
    var elevation = $this.attr('data-elevation');
    var url = 'http://api.powderlin.es/closest_stations?lat=' + lat + '&lng=' + lon + '&data=true&days=20&callback=?';
    var $total = $this.find('.total-depth');
    var $change = $this.find('.change-depth');
    var $distance = $this.find('.distance');
    var $elevation = $this.find('.elevation');
    
    var labels = [];
    var series = [[]];
    
    var container = $this.find('.ct-chart')[0]
    
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(stations) {
        
        if (stations[0].data[0]["Snow Depth (in)"]) {
          var closestStation = stations[0]; 
        } else if (stations[1].data[0]["Snow Depth (in)"]) {
          var closestStation = stations[1];
        } else if (stations[2].data[0]["Snow Depth (in)"]) {
          var closestStation = stations[2];
        } else {
          var closestStation = null;
        }
        
        if (closestStation) {
          var stationTotalDepth = closestStation.data[0]["Snow Depth (in)"];
          var stationChangeDepth = closestStation.data[0]["Change In Snow Depth (in)"];
          var stationDistance = Math.round( closestStation.distance * 10 ) / 10;
          var stationElevation = closestStation.station_information.elevation;
          var elevationDifference = elevation - stationElevation;
          
          $total.text(stationTotalDepth + 'in');
          $change.text(stationChangeDepth + 'in');
          $distance.text(stationDistance + ' miles away');
          $elevation.text(elevationDifference + ' feet away');
          
          var maxSnow = 0;
          var margin = 2;
          $.each(closestStation.data, function(i) {
            labels.push(new Date(this["Date"]).getTime());
            if (this["Snow Depth (in)"]) {
              series[0].push(this["Snow Depth (in)"]);
            } else {
              series[0].push(0);
            }
            
            if (this["Snow Depth (in)"] > maxSnow) {
              maxSnow = parseFloat(this["Snow Depth (in)"], 10);
            }
          });
      
          var data = {
            labels: labels,
            series: series
          };

          var options = {
            showPoint: false,
            lineSmooth: false,
            chartPadding: 0,
            axisX: {
              showGrid: false,
              showLabel: false,
              offset: 0
            },
            axisY: {
              showLabel: false,
              offset: 0
            },
            fullWidth: true,
            width: $(container).width(),
            height: $(container).height()
          };
          
          console.log(data);
          new Chartist.Line(container, data, options);
          
          var easeOutQuad = function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
          };
          
          var $chart = $(container);
          
          var $toolTip = $chart
            .append('<div class="tooltip"></div>')
            .find('.tooltip')
            .hide();
          
          $chart.on('mouseenter', '.ct-chart-line', function(event) {
            var $line = $(this).find('.ct-line');

            $toolTip.show();
          
            $line.animate({'stroke-width': '4px'}, 300, easeOutQuad);

          });
          
          $chart.on('mouseleave', '.ct-chart-line', function() {
            var $line = $(this).find('.ct-line');
          
            $line.animate({'stroke-width': '2px'}, 300, easeOutQuad);
            $toolTip.hide();
          });
          
          $chart.on('mousemove', function(event) {
            var $line = $(this).find('.ct-line'),
              totalWidth = parseInt(options.width, 10),
              parentOffset = $(this).parent().offset(),
              currentPosition = event.pageX - parentOffset.left,
              percentage = currentPosition/totalWidth,
              index = Math.round(data.labels.length * percentage),
              date = new Date(data.labels[index]),
              seriesName = data.series[0][index];
            
            $toolTip.html(seriesName + ' inches<br>' + months[date.getMonth()] + ' ' + date.getDate());
            
            $toolTip.css({
              left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
              top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
            });
          });
          
          
        } else {
          console.log('error');
        }
      },
      error: function() {
        $this.find('.graph').text('No worky');
      }
    });
  });
  
  $('.weather-info').each(function() {
    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lon = $this.attr('data-long');
    var url = 'http://forecast.weather.gov/MapClick.php?lat=' + lat + '&lon=' + lon + '&FcstType=json&callback=?';
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        console.log(data);
        
        var currentTemp = data.currentobservation.Temp + '&deg;';
        var weatherText = data.data.text;
        var weatherTemp = data.data.temperature;
        var weather = data.data.weather;
        var weatherIcon = data.data.iconLink;
        var times = data.time.startValidTime;
        var tempLabel = data.time.tempLabel;
        
        var $days  =  $this.find('.days th');
        var $highs =  $this.find('.highs td');
        var $lows  =  $this.find('.lows td');
        
                ////////////////////////////////////////////////////
        

        var mergedDays = [];
        
        $.each( times, function( i, time ) {
          var addDay = true;
          // check if day is already in array. if it is then add this info as an observation
          $.each(mergedDays, function(ind, data) {
            if (new Date(data.date).getDay() == new Date(time).getDay()) {
              mergedDays[ind].observations.push(
                {
                  "tempLabel": tempLabel[i],
                  "weatherText": weatherText[i],
                  "weatherTemp": weatherTemp[i]
                }
              );
              addDay = false;
            }
          });
          
          // day doesn't already exist so we set up the skeleton for it and add the first observation
          if (addDay) {
            mergedDays.push(
              {
                "date": time,
                "observations": [
                  {
                    "tempLabel": tempLabel[i],
                    "weatherText": weatherText[i],
                    "weatherTemp": weatherTemp[i]
                  }
                ]
              }
            );
          }
        });
        
        console.log(mergedDays);
        
        $.each(mergedDays, function(i) {
          var data = this;
          var observations = this.observations;
          var time = data.date;
          var date = new Date(time).getDate();
          var day = days[new Date(time).getDay()];
          var high = false;
          var low = false;
          $.each(observations, function() {
            if (this.tempLabel == "High") {
              high = this.weatherTemp;
            } else {
              low = this.weatherTemp;
            }
          });
          
          $days.eq(i).text(day);
          if (low) {
            $lows.eq(i).html(low + '&deg;'); 
          }
          if (high) {           
            $highs.eq(i).html(high + '&deg;');            
          }
          
          //console.log(dayIteration, date, dayIndex);


          
        });
        
      },
      error: function(error) {
        //console.log(error);
      }
    })
  });
  
  $('.weathered').each(function() {
    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lon = $this.attr('data-long');
    var url = 'http://forecast.weather.gov/MapClick.php?lat=' + lat + '&lon=' + lon + '&FcstType=json&callback=?';
    
    $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: false,
      jsonpCallback: "weather",
      success: function(data) {
//        console.log(data);
        var currentTemp = data.currentobservation.Temp + '&deg;';
        var weatherText = data.data.text;
        var weatherTemp = data.data.temperature;
        var weather = data.data.weather;
        var weatherIcon = data.data.iconLink;
        var time = data.time.startPeriodName;
        var skycons = new Skycons({"color": "#f1ebeb"});
        
        var output = '';//currentTemp;
        
        output += '<ul>';
        $.each(weatherText, function(i) {
          var truncatedIcon = weatherIcon[i].replace(/.*?\//g, '').replace(/[0-9]/g,'').replace(/.png/,'')
          output += '<li><div class="icon"><canvas class="skycon" data-icon="' + icons[truncatedIcon] + '" id="icon-' + i + '" width="40px" height="40px"></canvas><div>' + weatherTemp[i] + '&deg;</div></div><div><h6><strong>' + time[i] + '</strong>: ' + weather[i] + '</h6>' + this + '</div></li>';
        });
        output += '</ul>';
        
        $this.html(output);
        
        $('.skycon').each(function() {
          var $this = $(this);
          var icon = $this.attr('data-icon');
          skycons.add($this[0], Skycons[icon]);
        });
        
        //skycons.play();
      },
      error: function(error) {
        //console.log(error);
      }
    })
  });
});