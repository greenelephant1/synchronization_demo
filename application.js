$( document ).ready(function() {
    $("#play_button").click(function() {
        algorithm_selection = $("#algorithm_dropdown").val();

        var algorithm;

        switch(algorithm_selection) {
            case 'peterson':
                algorithm = new PetersonsAlgorithm();
                break;
            default:
                algorithm = new NoneAlgorithm();
        }

        $("#title_page").hide();
        $("#canvas").css('display', 'block' );
        $("#canvas").show();
        animation = new Animation(algorithm);
        animation.animate();
    });
});
