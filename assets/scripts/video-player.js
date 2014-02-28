$(function() {
  $('.video-gallery').each(function() {
    $videoGallery = $(this);
    $videoGallery.find('.video-thumb').on('click', function(e) {
      var $this = $(this),
          url = $this.attr('href');
      $videoGallery.find(".video-player").html('<a href="' + url + '" class="embed"></a>')
      $videoGallery.find(".embed").oembed(null, {
        includeHandle: false,
        embedMethod: 'replace'
      });
      $this.closest('li').addClass('active').siblings('.active').removeClass('active');
      e.preventDefault();
    });
  });
});