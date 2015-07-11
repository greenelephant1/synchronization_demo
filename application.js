$( document ).ready(function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var continue_demo = true;

    var fps = 60;
    var radius = 20;

    var critical_section = { start_x: canvas.width * 0.4, end_x: canvas.width * 0.6,
        start_y: canvas.height * 0.4, end_y: canvas.height * 0.6
     }

    var tracks = [
        {
            start_x: 0, start_y: canvas.height/2,
            critical_start_x: critical_section.start_x, critical_start_y: canvas.height/2,
            critical_end_x: critical_section.end_x, critical_end_y: canvas.height/2,
            end_x: canvas.width, end_y: canvas.height/2
        },
        {
            start_x: canvas.width/2, start_y: 0,
            critical_start_x: canvas.width/2, critical_start_y: critical_section.start_y,
            critical_end_x: canvas.width/2, critical_end_y: critical_section.end_y,
            end_x: canvas.width/2, end_y: canvas.height
        },
    ];

    var processes = [
       { percent: 0, direction: 1, color: 'blue', speed: 1 },
       { percent: 0, direction: 1, color: 'green', speed: 1 }
    ];

    animate();

    function animate() {
        var active_processes = false;

        for (var index = 0; index < processes.length; index++) {
            var process = processes[index];
            process.percent = process.percent + process.direction * process.speed;
            if (process.percent < 105) {
                active_processes = true;
            }
        }

        continue_demo = continue_demo && active_processes;
        draw();

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
            drawTrack(track);
        }

        for (var index = 0; index < processes.length; index++) {
            var process = processes[index];
            var track = tracks[index];

            process.x = track.start_x + (track.end_x - track.start_x) * process.percent/100;
            process.y = track.start_y + (track.end_y - track.start_y) * process.percent/100;
            drawObject(process.x, process.y, process.color);
        }

        if(Math.abs(processes[0].x - processes[1].x) < radius && Math.abs(processes[0].y - processes[1].y) < radius) {
            continue_demo = false;
            animateExplosion((processes[0].x + processes[1].x)/2, (processes[0].y + processes[1].y)/2);
        }

    }

    function drawObject(x, y, color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI, true)
        ctx.fill();
        ctx.stroke();
    }

    function drawTrack(track){
        ctx.lineWidth = 45;
        ctx.beginPath();
        ctx.moveTo(track.start_x, track.start_y);
        ctx.lineTo(track.critical_start_x, track.critical_start_y);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(track.critical_start_x, track.critical_start_y);
        ctx.lineTo(track.critical_end_x, track.critical_end_y);
        ctx.strokeStyle = 'red';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(track.critical_end_x, track.critical_end_y);
        ctx.lineTo(track.end_x, track.end_y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    function animateExplosion(x, y){
        ctx.font = "60px Arial";
        ctx.fillStyle = "orange";
        ctx.lineWidth = 3;
        ctx.fillText("Boom!",x,y);
    }
});
