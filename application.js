$( document ).ready(function() {
    var animation;

    $("#play_button").click(function() {
        $("#process_1_screen, #process_2_screen, #shared_data_screen").html('');

        if (typeof animation !== 'undefined') {
            animation.endDemo();
        }

        algorithm_selection = $("#algorithm_dropdown").val();

        $("#continue_button").hide();
        $("#shared_definition, #shared_definition_title").text('');
        $("#shared_definition_table").hide();

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

        if(algorithm.centered_canvas){
            $("canvas").css("margin-left", "225px");
        } else {
            $("canvas").css("margin-left", "10px");
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
