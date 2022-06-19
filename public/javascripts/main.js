window.addEventListener("load", function () {
    var socket = io.connect("/");
    var canvas = document.getElementById("myCanvas");
    var c = canvas.getContext("2d");
    var w = 1075;
    var h = 1079;
    var drawing = false;
    var oldPos;
    // Image オブジェクトを生成
    var img = new Image();
    img.src = './public/image/20220618044054_1.jpg';

    // 画像読み込み終了してから描画
    img.onload = function () {
        c.drawImage(img, 10, 10);
    }

    canvas.width = w;
    canvas.height = h;
    c.strokeStyle = "#000000";
    c.lineWidth = 3;
    c.lineJoin = "round";
    c.lineCap = "round";

    function scrollX() {
        return document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    function scrollY() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    }
    function getPos(event) {
        var mouseX = event.clientX - $(canvas).position().left + scrollX();
        var mouseY = event.clientY - $(canvas).position().top + scrollY();
        return { x: mouseX, y: mouseY };
    }
    function getPosT(event) {
        var mouseX = event.touches[0].clientX - $(canvas).position().left + scrollX();
        var mouseY = event.touches[0].clientY - $(canvas).position().top + scrollY();
        return { x: mouseX, y: mouseY };
    }
                       
    canvas.addEventListener("mousedown", function (event) {
        console.log("mousedown");
        drawing = true;
        oldPos = getPos(event);
    }, false);
    canvas.addEventListener("mouseup", function () {
        console.log("mouseup");
        drawing = false;
    }, false);
    canvas.addEventListener("mousemove", function (event) {
        var pos = getPos(event);
        console.log("mousemove : x=" + pos.x + ", y=" + pos.y + ", drawing=" + drawing);
        if (drawing) {
            c.beginPath();
            c.moveTo(oldPos.x, oldPos.y);
            c.lineTo(pos.x, pos.y);
            c.stroke();
            c.closePath();
            socket.emit("draw", { before: oldPos, after: pos });
            oldPos = pos;
        }
    }, false);
    canvas.addEventListener("mouseout", function () {
        console.log("mouseout");
        drawing = false;
    }, false);
    $("#black").click(function () { c.strokeStyle = "black"; socket.emit("color", "black"); });
    $("#blue").click(function () { c.strokeStyle = "blue"; socket.emit("color", "blue"); });
    $("#red").click(function () { c.strokeStyle = "red"; socket.emit("color", "red"); });
    $("#green").click(function () { c.strokeStyle = "green"; socket.emit("color", "green"); });
    $("#small").click(function () { c.lineWidth = 3; socket.emit("lineWidth", 5); });
    $("#clear").click(function () {
        c.clearRect(0, 0, w, h);
        var img = new Image();
        img.src = './public/image/20220618044054_1.jpg';

        // 画像読み込み終了してから描画
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
        socket.emit("clear")
    });
    socket.on("draw", function (data) {
        console.log("on draw : " + data);
        c.beginPath();
        c.moveTo(data.before.x, data.before.y);
        c.lineTo(data.after.x, data.after.y);
        c.stroke();
        c.closePath();
    });
    socket.on("color", function (data) {
        console.log("on color : " + data);
        c.strokeStyle = data;
    });
    socket.on("clear", function (data) {
        console.log("on clear : " + data);
        c.clearRect(0, 0, w, h);
        img.src = './public/image/20220618044054_1.jpg';

        // 画像読み込み終了してから描画
        img.onload = function () {
            c.drawImage(img, 10, 10);
        }
        data = [];
    })
    socket.on("lineWidth", function (data) {
        console.log("on lineWidth : " + data);
        c.lineWidth = data;
    });
}, false);