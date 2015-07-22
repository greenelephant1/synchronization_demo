$( document ).ready(function() {
    var animation;

    $("#play_button").click(function() {
        $("#process_1_screen, #process_2_screen, #shared_data_screen").html('');

        if (typeof animation !== 'undefined') {
            animation.endDemo();
        }

        algorithm_selection = $("#algorithm_dropdown").val();

        $("#continue_button").hide();
        $("#shared_definition").text('');
        $("#shared_definition").hide();

        var algorithm;

        switch(algorithm_selection) {
            case 'peterson':
                algorithm = new PetersonsAlgorithm();
                break;
            case 'mutex':
                algorithm = new MutexAlgorithm();
                break;
            case 'semaphore':
                algorithm = new SemaphoreAlgorithm();
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

    $("#continue_button").click(function() {
        animation.unpauseDemo();
    });
});
