$( document ).ready(function() {
    var animation;

    $("#play_button").click(function() {
        algorithm_selection = $("#algorithm_dropdown").val();

        var algorithm;

        switch(algorithm_selection) {
            case 'peterson':
                algorithm = new PetersonsAlgorithm();
                break;
            case 'mutex':
                algorithm = new MutexAlgorithm();
                break;
            default:
                algorithm = new NoneAlgorithm();
        }

        $("#title_page").hide();
        $("#canvas").css('display', 'block' );
        $("#canvas").show();

        if (typeof animation !== 'undefined') {
            animation.endDemo();
        }
        animation = new Animation(algorithm);
        animation.animate();
    });

    $("#continue_button").click(function() {
        animation.unpauseDemo();
    });
});
