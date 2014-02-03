$(function() {
  $('.scroll-arrow').on('click', function(e) {
    var target = $('.scroll-arrow').attr('href');
    $('html, body').animate({scrollTop: $(target).offset().top}, 400);
    e.preventDefault();
  });
});