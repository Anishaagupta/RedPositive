var height = $('.top-menu').height();

$(window).scroll(function () {
    if($(this).scrollTop() > height){
        $('#navbar').addClass('fixed');
    } else {
        $('#navbar').removeClass('fixed');
    }
});