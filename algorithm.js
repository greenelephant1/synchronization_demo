function NoneAlgorithm (){
    this.start_paused = false;

    $("#process_data_table").hide();

    this.enterCriticalSection = function() {
        return true;
    };

    this.exitCriticalSection = function() {
    };

    this.checkAvailablilty = function() {
        return true;
    };
}

function PetersonsAlgorithm (){
    var flag = new Object();
    var turn;
    var this_algorithm = this;
    this.start_paused = true;

    setupDisplay();

    highlightCodeLines("#process_1_screen", [1]);
    highlightCodeLines("#process_2_screen", [1]);

    this.checkAvailablilty = function() {

        if(flag[this.other_color] && turn === this.other_color){
            highlightCodeLines(this.process_screen_identifier, [5, 6, 7]);

            if(this.state != 'paused'){
                this.state = 'paused';
                this.pauseDemo();
            }

            return false;
        } else {
            highlightCodeLines(this.process_screen_identifier, [8]);
            if(this.state != 'has_right_of_way'){
                this.state = 'has_right_of_way';
                this.pauseDemo();
            }
            return true;
        }
    };

    this.enterCriticalSection = function() {
        this.pauseDemo();

        this.other_color = otherColor(this.color);
        this.process_screen_identifier = "#process_" + this.process_num + "_screen";
        flag[this.color] = true;
        turn = this.other_color;

        coloredOutput("#process_" + this.process_num + "_flag_val", "true", this.color);

        coloredOutput("#turn_val", this.other_color, this.color);
        highlightCodeLines(this.process_screen_identifier, [3, 4]);

        return this_algorithm.checkAvailablilty.call(this);
    };


    this.exitCriticalSection = function() {
        this.pauseDemo();

        flag[this.color] = false;

        highlightCodeLines(this.process_screen_identifier, [11]);
        coloredOutput("#process_" + this.process_num + "_flag_val", "false", this.color);
    };

    function otherColor(this_color){
        if (this_color == 'blue'){
            return 'green';
        } else {
            return 'blue';
        }
    }

    function setupDisplay() {
        $("#shared_data_screen").html(
            "flag =  <table id='petersons_flag_table'> \n\
              <tr> \n\
                <th>blue</td> \n\
                <th>green</td> \n\
              </tr> \n\
              <tr> \n\
                <td><span id='process_1_flag_val'>false</span></td> \n\
                <td><span id='process_2_flag_val'>false</span></td> \n\
              </tr> \n\
            </table> \n\
            </br> \n\
            </br> \n\
            turn = <span id='turn_val'>nil<span>"
        );

        $("#process_1_screen").html(processCodeHtml('blue', 'green'));
        $("#process_2_screen").html(processCodeHtml('green', 'blue'));


        $("#process_data_table").css('display', 'block' );
        $("#process_data_table").show();

        function processCodeHtml(this_process_color, other_process_color){
            return "<div>EXECUTE SAFE SECTION</div>" +
                "<div>//approach critical section</div>" +
                "<div>flag['" + this_process_color + "'] = true; </div>" +
                "<div>turn = '" + other_process_color +"'; </div>" +
                "<div>while ( flag['" + other_process_color + "'] && turn == " +  other_process_color + ") { </div>" +
                "<div class='wait'>&nbsp;&nbsp;&nbsp;&nbsp;WAIT</div>" +
                "<div>}</div>" +
                "<div>CRITICAL SECTION</div>" +
                "<div>//exit critical section</div>" +
                "<div>flag['" + this_process_color + "'] = false; </div>" +
                "<div>EXECUTE SAFE SECTION</div>"
        }
    }
}


function MutexAlgorithm (){
    var flag = new Object();
    var turn;
    var this_algorithm = this;
    this.start_paused = true;

    setupDisplay();

    this.checkAvailablilty = function() {
    };

    this.enterCriticalSection = function() {

    };


    this.exitCriticalSection = function() {

    };

    function otherColor(this_color){

    }

    function setupDisplay() {


        function processCodeHtml(this_process_color, other_process_color){

        }
    }
}



function coloredOutput (selector, html_content, color){
    $(selector).html(html_content);
    $(selector).css("color", color);
}

function highlightCodeLines(parent_container, lines){
    $(parent_container + " div").css("background-color", 'white');

    for (var i = 0; i < lines.length; i++) {
        $(parent_container + " div:nth-child(" + lines[i] +')').css("background-color", 'yellow');
    }
}


