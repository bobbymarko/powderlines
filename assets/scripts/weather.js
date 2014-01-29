// capture weather info for gps point from weather.gov
$(function(){
  $('.weathered').each(function() {
    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lon = $this.attr('data-long');
    var url = 'http://forecast.weather.gov/MapClick.php?lat=' + lat + '&lon=' + lon + '&FcstType=json&callback=?';
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
                  "mist": "FOG"
                }
    
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
        var skycons = new Skycons({"color": "white"});
        
        var output = '';//currentTemp;
        
        output += '<ul class="small-block-grid-6 text-center">';
        $.each(weatherText, function(i) {
          var truncatedIcon = weatherIcon[i].replace(/.*?\//g, '').replace(/[0-9]/g,'').replace(/.png/,'')
          output += '<li><p>' + time[i] + '</p><canvas class="skycon" data-icon="' + icons[truncatedIcon] + '" id="icon-' + i + '" width="120" height="120"></canvas>' + '<p>' + weather[i] + '<br>' + weatherTemp[i] + '&deg;</p></li>';
        });
        output += '</ul>';
        
        $this.html(output);
        
        $('.skycon').each(function() {
          var $this = $(this);
          var icon = $this.attr('data-icon');
          skycons.add($this[0], Skycons[icon]);
        });
        
        skycons.play();
      },
      error: function(error) {
        //console.log(error);
      }
    })
  });
});