function NoneAlgorithm (){
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

    setupDisplay();

    this.checkAvailablilty = function() {
        if(flag[this.other_color] && turn === this.other_color){
            return false;
        } else {
            return true;
        }
    };

    this.checkAvailabliltyDisplay = function() {
        highlightCodeLine("#process_" + this.process_num + "_screen", 3);
        var this_process = this;

        setContinueButton(function () {
            this_algorithm.checkAvailabliltyDisplay2.call(this_process);
        });
    };

    this.checkAvailabliltyDisplay2 = function() {
        if(flag[this.other_color] && turn === this.other_color){
            highlightCodeLine("#process_" + this.process_num + "_screen", 4);
        } else {
            highlightCodeLine("#process_" + this.process_num + "_screen", 6);
        }

        var this_process = this;

        setContinueButton(function () {
            this_process.unpauseDemo();
        });
    }

    this.enterCriticalSection = function() {
        this.pauseDemo();

        this.other_color = otherColor(this.color)
        flag[this.color] = true;
        turn = this.other_color;

        var has_right_of_way = this_algorithm.checkAvailablilty.call(this)

        this_algorithm.enterCriticalSectionDisplay.call(this);
        return has_right_of_way;
    };

    this.enterCriticalSectionDisplay = function() {
        coloredOutput("#process_" + this.process_num + "_flag_val", "true", this.color);
        highlightCodeLine("#process_" + this.process_num + "_screen", 1);

        var this_process = this;

        setContinueButton(function () {
            this_algorithm.enterCriticalSectionDisplay2.call(this_process);
        });
    }

    this.enterCriticalSectionDisplay2 = function() {
        coloredOutput("#turn_val", this.other_color, this.color);
        highlightCodeLine("#process_" + this.process_num + "_screen", 2);

        var this_process = this;

        setContinueButton(function () {
            this_algorithm.checkAvailabliltyDisplay.call(this_process);
        });
    }

    this.exitCriticalSection = function() {
        flag[this.color] = false;
        this.pauseDemo();
        this_algorithm.exitCriticalSectionDisplay.call(this);
    };

    this.exitCriticalSectionDisplay = function() {
        highlightCodeLine("#process_" + this.process_num + "_screen", 7);
        coloredOutput("#process_" + this.process_num + "_flag_val", "false", this.color);

        var this_process = this;

        setContinueButton(function () {
            this_process.unpauseDemo();
        });
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
            return "<div>flag['" + this_process_color + "'] = true; </div>" +
                "<div>turn = '" + other_process_color +"'; </div>" +
                "<div>while ( flag['" + other_process_color + "'] && turn == " +  other_process_color + ") { </div>" +
                "<div class='wait'>&nbsp;&nbsp;&nbsp;&nbsp;WAIT</div>" +
                "<div>}</div>" +
                "<div>CRITICAL SECTION</div>" +
                "<div>flag['" + this_process_color + "'] = false; </div>"
        }
    }
}

function coloredOutput (selector, html_content, color){
    $(selector).html(html_content);
    $(selector).css("color", color);
}

function highlightCodeLine(parent_container, line){
    $(parent_container + " div").css("background-color", 'white');
    $(parent_container + " div:nth-child(" + line +')').css("background-color", 'yellow');
}

function setContinueButton(behavior) {
    $("#continue_button").show();
    $("#continue_button").click(function() {
        behavior();
    });
}


