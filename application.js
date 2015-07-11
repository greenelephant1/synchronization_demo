$( document ).ready(function() {
    $("#play_button").click(function() {
        $("#title_page").hide();
        $("#canvas").show();
        animation = new Animation();
        animation.animate();
    });
});
