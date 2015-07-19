$( document ).ready(function() {
    $("#play_button").click(function() {
        var algorithm = new NoneAlgorithm();
        $("#title_page").hide();
        $("#canvas").css('display', 'block' );
        $("#canvas").show();
        animation = new Animation(algorithm);
        animation.animate();
    });
});
