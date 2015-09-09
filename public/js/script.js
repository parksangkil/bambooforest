$(document).ready(function() {
  $('#menuToggle').on('click', function() {
    $('.mobile-nav').toggleClass('isOpen');
    console.log("toggle");
  });
});