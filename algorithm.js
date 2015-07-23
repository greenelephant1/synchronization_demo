function NoneAlgorithm (){
    this.start_paused = false;
    this.centered_canvas = true;

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

    this.centered_canvas = true;

    this.start_paused = true;

    setupDisplay();

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
            "<div>flag = <table id='petersons_flag_table'>" +
            "<tr>" +
            "<th>blue</td>" +
            "<th>green</td>" +
            "</tr>" +
            "<tr>" +
            "<td><span id='process_1_flag_val'>false</span></td>" +
            "<td><span id='process_2_flag_val'>false</span></td>" +
            "</tr>" +
            "</div>" +
            "</table>" +
            "</br>" +
            "</br>" +
            "<div>turn = <span id='turn_val'>nil<span></div>"
        );

        $("#process_1_screen").html(processCodeHtml('blue', 'green'));
        $("#process_2_screen").html(processCodeHtml('green', 'blue'));


        $("#process_data_table").css('display', 'block' );
        $("#process_data_table").show();

        highlightCodeLines("#process_1_screen", [1]);
        highlightCodeLines("#process_2_screen", [1]);


        function processCodeHtml(this_process_color, other_process_color){
            return "<div>SAFE SECTION</div>" +
                "<div>//approach critical section</div>" +
                "<div>flag['" + this_process_color + "'] = true; </div>" +
                "<div>turn = '" + other_process_color +"'; </div>" +
                "<div>while ( flag['" + other_process_color + "'] && turn == " +  other_process_color + ") { </div>" +
                "<div class='wait indent1'>WAIT</div>" +
                "<div>}</div>" +
                "<div>CRITICAL SECTION</div>" +
                "<div>//exit critical section</div>" +
                "<div>flag['" + this_process_color + "'] = false; </div>" +
                "<div>SAFE SECTION</div>"
        }
    }
}


function MutexAlgorithm (){

    //Since (1) the processes in this demo move in a loop and not truly concurrently and
    // (2) only one process is blocked at a time because there are only two processes
    //the "mutex lock" below does not need a mechanism to ensure that operations on 'available' are performed atomically
    //like a real mutex lock in an os would

    function mutex (){
        var this_mutex = this;
        this.centered_canvas = false;


        var  available = true;

        this.aquire = function(process) {
            if(!available){
                setTimeout(function () {
                    this_mutex.aquire(process);
                }, 1000);
            } else {
                process.right_of_way_aquired = true;
                available = false;
            }
        }

        this.release = function() {
            available = true;
        }
    };

    var this_algorithm = this;

    this.start_paused = true;

    setupDisplay();

    mutex = new mutex();

    this.enterCriticalSection = function() {
        this.right_of_way_aquired = false;
        this.already_had_right_of_way = false;
        this.process_screen_identifier = "#process_" + this.process_num + "_screen";

        this.pauseDemo();

        mutex.aquire(this);

        var got_right_of_way  =  this.right_of_way_aquired;
        if(got_right_of_way){
            highlightCodeLines( this.process_screen_identifier, [3, 4]);
            coloredOutput("#mutex_available", "false", this.color);
            coloredOutput("#mutex_process_" + this.process_num + "_status", this.color + " aquired lock", this.color);

        } else {
            highlightCodeLines( this.process_screen_identifier, [3]);
            coloredOutput("#mutex_process_" + this.process_num + "_status", this.color + " is spin waiting", this.color);
        }

        return got_right_of_way;
    };

    this.checkAvailablilty = function() {
        var got_right_of_way = this.right_of_way_aquired;

        if(got_right_of_way){
            highlightCodeLines( this.process_screen_identifier, [4]);
            coloredOutput("#mutex_process_" + this.process_num + "_status", this.color + " aquired lock", this.color);
            if (!this.already_had_right_of_way){
                this.pauseDemo();
                this.already_had_right_of_way = true;
            }
        } else {
            highlightCodeLines( this.process_screen_identifier, [3]);
            coloredOutput("#mutex_process_" + this.process_num + "_status", this.color + " is spin waiting", this.color);
        }

        return this.right_of_way_aquired;
    };

    this.exitCriticalSection = function() {
        mutex.release();
        this.pauseDemo();
        highlightCodeLines(this.process_screen_identifier, [7]);
        coloredOutput("#mutex_available", "true", this.color);
        coloredOutput("#mutex_process_" + this.process_num + "_status", this.color + " released lock", this.color);
    };

    function setupDisplay() {

        $("#shared_data_screen").html(
            "<div>mutex.availabale = <span id='mutex_available'>true</span></div>" +
            "<div id='mutex_process_1_status'></div>" +
            "<div id='mutex_process_2_status'></div>"
        );

        $("#process_1_screen, #process_2_screen").html(
            "<div>SAFE SECTION</div>" +
            "<div>//approach critical section</div>" +
            "<div>mutex.aquire();</div>" +
            "<div>CRITICAL SECTION</div>" +
            "<div>//exit critical section</div>" +
            "<div>mutex.release();</div>" +
            "<div>SAFE SECTION</div>"

        );

        $("#process_data_table").show();

        $("#shared_definition").html(
            "<div>class Mutex() {</div>" +
            "<div class='indent1'>bool available = false;</div>" +
            "<br>" +
            "<div class='indent1'>aquire() {</div>" +
            "<div class='indent2'>while(!available) {</div>" +
            "<div class='indent3'>BUSY WAIT</div>" +
            "<div class='indent2'>}</div>" +
            "<div class='indent2'>available = false; </div>" +
            "<div class='indent1'>} </div>" +
            "<br>" +
            "<div class='indent1'>release() {</div>" +
            "<div class='indent2'>available = true; </div>" +
            "<div class='indent1'>} </div>" +
            "<div>}</div>"
        );

        $("#shared_definition_title").html("Mutex Definition");

        $("#shared_definition_table").show();


        highlightCodeLines("#process_1_screen", [1]);
        highlightCodeLines("#process_2_screen", [1]);
    }
}

function SemaphoreAlgorithm (){
    this.start_paused = true;
    this.centered_canvas = false;

    //As in the MutexAlgorithm, we don't enforce that operations are performed  atomically becouse the processes in
    //the demo aren't truly concurrent
    var semaphore = 1;

    function wait(process){
        if (semaphore <= 0){
            setTimeout(function () {
                wait(process);
            }, 1000);
        } else {
            semaphore--;
            process.right_of_way_aquired = true;
        }

    }

    function signal(){
        semaphore++;
    }

    setupDisplay();

    this.enterCriticalSection = function() {
        this.pauseDemo();

        this.right_of_way_aquired = false;
        this.already_had_right_of_way = false;
        this.process_screen_identifier = "#process_" + this.process_num + "_screen";
        wait(this);

        var got_right_of_way  =  this.right_of_way_aquired;

        if(got_right_of_way){
            highlightCodeLines( this.process_screen_identifier, [3, 4]);
            coloredOutput("#semaphore_val", "0", this.color);
            coloredOutput("#semaphore_process_" + this.process_num + "_status",
                this.color + " finished waiting", this.color);

        } else {
            highlightCodeLines( this.process_screen_identifier, [3]);
            coloredOutput("#semaphore_process_" + this.process_num + "_status",
                this.color + " is spin waiting", this.color);
        }

        return got_right_of_way;

    };

    this.checkAvailablilty = function() {
        got_right_of_way =  this.right_of_way_aquired;

        if(got_right_of_way){
            highlightCodeLines( this.process_screen_identifier, [4]);
            coloredOutput("#semaphore_val", "0", this.color);

            coloredOutput("#semaphore_process_" + this.process_num + "_status",
                this.color + " finished waiting", this.color);

            if (!this.already_had_right_of_way){
                this.pauseDemo();
                this.already_had_right_of_way = true;
            }

        } else {
            highlightCodeLines( this.process_screen_identifier, [3]);
            coloredOutput("#semaphore_process_" + this.process_num + "_status",
                this.color + " is spin waiting", this.color);
        }

        return this.right_of_way_aquired;
    };

    this.exitCriticalSection = function() {
        signal();
        this.pauseDemo();
        highlightCodeLines(this.process_screen_identifier, [7]);
        coloredOutput("#semaphore_val", 1, this.color);
        coloredOutput("#semaphore_process_" + this.process_num + "_status", this.color + " finished signaling", this.color);
    };

    function setupDisplay() {

        $("#shared_definition").html(
            "<div>wait(Semaphore) {</div>" +
            "<div class='indent1'>while( Semaphore <= 0 ) {</div>" +
            "<div class='indent2'>BUSY WAIT</div>" +
            "<div class='indent1'>}</div>" +
            "<div class='indent1'>Semaphore--;</div>" +
            "<div>}</div>" +
            "<br>" +
            "<div>signal(Semaphore) {</div>" +
            "<div class='indent1'>Semaphore++;</div>" +
            "<div>}</div>"
        )

        $("#shared_definition_title").html("Semaphore Definition");

        $("#shared_definition_table").show();


        $("#shared_data_screen").html(
            "<div>Semaphore.val() = <span id='semaphore_val'>1</span></div>"+
            "<div id='semaphore_process_1_status'></div>" +
            "<div id='semaphore_process_2_status'></div>"
        );

        $("#process_1_screen, #process_2_screen").html(
            "<div>SAFE SECTION</div>" +
            "<div>//approach critical section</div>" +
            "<div>wait(Semaphore);</div>" +
            "<div>CRITICAL SECTION</div>" +
            "<div>//exit critical section</div>" +
            "<div>signal(Semaphore);</div>" +
            "<div>SAFE SECTION</div>"
        );

        $("#process_data_table").show();

        highlightCodeLines("#process_1_screen", [1]);
        highlightCodeLines("#process_2_screen", [1]);
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


