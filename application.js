$( document ).ready(function() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var fps = 60;
    var radius = 20;

    var tracks = [
        {
            start_x: 0, start_y: canvas.height/2,
            critical_start_x: canvas.width * 0.3, critical_start_y: canvas.height/2,
            critical_end_x: canvas.width * 0.7, critical_end_y: canvas.height/2,
            end_x: canvas.width, end_y: canvas.height/2
        },
        {
            start_x: canvas.width/2, start_y: 0,
            critical_start_x: canvas.width/2, critical_start_y: canvas.height * 0.3,
            critical_end_x: canvas.width/2, critical_end_y: canvas.height * 0.7,
            end_x: canvas.width/2, end_y: canvas.height
        },
    ];

    var processes = [
       { percent: 0, direction: 1, color: 'blue', speed: 0.5},
       { percent: 0, direction: 1, color: 'green', speed: 1.5}
    ];

    animate();

    function animate() {
        for (var index = 0; index < processes.length; index++) {
            var process = processes[index];

            process.percent += process.direction * process.speed;
            if (process.percent < 0) {
                process.percent = 0;
                process.direction = 1;
            };
            if (process.percent > 100) {
                process.percent = 100;
                process.direction = -1;
            };
        }

        draw();

        // request another frame
        setTimeout(function () {
            requestAnimationFrame(animate);
        }, 1000 / fps);
    }


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var index = 0; index < tracks.length; index++) {
            var track = tracks[index];
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

        for (var index = 0; index < processes.length; index++) {
            var process = processes[index];
            var track = tracks[index];

            var x = track.start_x + (track.end_x - track.start_x) * process.percent/100;
            var y = track.start_y + (track.end_y - track.start_y) * process.percent/100;
            drawObject(x, y, process.color);
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
});
