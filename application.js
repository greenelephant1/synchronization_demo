$( document ).ready(function() {
    $("#play_button").click(function() {
        var algorithm = $("#algorithm_dropdown").val();
        $("#title_page").hide();
        $("#canvas").show();
        animation = new Animation();
        animation.animate();
    });
});
