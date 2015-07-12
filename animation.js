function Animation (){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var continue_demo = true;

    var fps = 60;
    var radius = 20;

    var critical_section = { start_x: canvas.width * 0.4, end_x: canvas.width * 0.6,
        start_y: canvas.height * 0.4, end_y: canvas.height * 0.6
    };

    var tracks = [];
    tracks.push( new Track(
            {
                start_x: 0, start_y: canvas.height/2,
                critical_start_x: critical_section.start_x, critical_start_y: canvas.height/2,
                critical_end_x: critical_section.end_x, critical_end_y: canvas.height/2,
                end_x: canvas.width, end_y: canvas.height/2
            }
        )
    );

    tracks.push( new Track(
            {
                start_x: canvas.width/2, start_y: 0,
                critical_start_x: canvas.width/2, critical_start_y: critical_section.start_y,
                critical_end_x: canvas.width/2, critical_end_y: critical_section.end_y,
                end_x: canvas.width/2, end_y: canvas.height
            }
        )
    );

    var processes = [];
    processes.push( new Process(
           { percent: 0, direction: 1, color: 'blue', speed: 1, track: tracks[0] }
        )
    );

    processes.push( new Process(
           { percent: 0, direction: 1, color: 'green', speed: 1, track: tracks[1] }
        )
    );

    this.animate = function() {
      animate();
    };


    function animate() {
        var active_processes = false;

        draw();

        for (var index = 0; index < processes.length; index++) {
            var process = processes[index];
            process.iterate();

            if (process.percent < 105) {
                active_processes = true;
            }
        }

        continue_demo = continue_demo && active_processes;

        if (continue_demo){
            setTimeout(function () {
                requestAnimationFrame(animate);
            }, 1000 / fps);
        }
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var index = 0; index < tracks.length; index++) {
            var track = tracks[index];
            track.draw();
        }

        for (var index = 0; index < processes.length; index++) {
            var process = processes[index];
            process.draw();
        }

        if(Math.abs(processes[0].x - processes[1].x) < radius
             && (processes[0].y - processes[1].y) < radius) {
            continue_demo = false;
            animateExplosion((processes[0].x + processes[1].x)/2, (processes[0].y + processes[1].y)/2);
        }
    }

    function Track(params){
        this.start_x = params.start_x;
        this.start_y = params.start_y;
        this.end_x = params.end_x;
        this.end_y = params.end_y;
        this.critical_start_x = params.critical_start_x;
        this.critical_end_x = params.critical_end_x;
        this.critical_start_y = params.critical_start_y;
        this.critical_end_y = params.critical_end_y;

        this.draw = function() {
            ctx.lineWidth = 45;
            ctx.beginPath();
            ctx.moveTo(this.start_x, this.start_y);
            ctx.lineTo(this.critical_start_x, this.critical_start_y);
            ctx.strokeStyle = 'black';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.critical_start_x, this.critical_start_y);
            ctx.lineTo(this.critical_end_x, this.critical_end_y);
            ctx.strokeStyle = 'red';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.critical_end_x, this.critical_end_y);
            ctx.lineTo(this.end_x, this.end_y);
            ctx.strokeStyle = 'black';
            ctx.stroke();
        };

    }

    function Process(params){
        this.percent = params.percent;
        var direction = params.direction;
        var color = params.color;
        var speed = params.speed;
        var track = params.track;

        this.iterate = function() {
            this.percent = this.percent + direction * speed;
            this.x  = track.start_x + (track.end_x - track.start_x) * this.percent/100;
            this.y  = track.start_y + (track.end_y - track.start_y) * this.percent/100;
        };

        this.draw = function() {
            ctx.fillStyle = color;
            ctx.strokeStyle = "gray";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2*Math.PI, true);
            ctx.fill();
            ctx.stroke();
        };
    }

    function animateExplosion(x, y){
        ctx.font = "60px Arial";
        ctx.fillStyle = "orange";
        ctx.lineWidth = 3;
        ctx.fillText("Boom!",x,y);
    }
}
