// capture weather info for gps point from weather.gov
$(function(){
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
        
        var output = currentTemp;
        
        output += '<ul>';
        $.each(weatherText, function(i) {
          output += '<li><p>' + time[i] + '</p><img src="' + weatherIcon[i] + '"/>' + '<p>' + weather[i] + '</p><p>' + weatherTemp[i] + '</p>' + this + '</li>';
        });
        output += '</ul>';
        
        $this.html(output);
      },
      error: function(error) {
        //console.log(error);
      }
    })
  });
});