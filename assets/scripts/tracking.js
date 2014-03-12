$(function(){
  $('a:not([href*="' + document.domain + '"])').mousedown(function(event){
    // Just in case, be safe and don't do anything
    if (typeof ga == 'undefined') {
      return;
    }

    var link = $(this);
    var href = link.attr('href');
    if (href.charAt(0) != '.' && href.charAt(0) != '#' && href.charAt(0) != '/') {
       var noProtocol = href.replace(/http[s]?:\/\//, '');
       // Track the event
       ga('send', 'event', 'outbound', 'click', href);
    }
   });
});