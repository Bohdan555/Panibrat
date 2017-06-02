(function($){
$(window).on('load',function(){
    $('.mySlick').slick({
      infinite: true,
      dots:true,
      speed: 300,
      slidesToShow: 4,      
      centerMode: true,
      variableWidth: true
  });
});
})(jQuery)
