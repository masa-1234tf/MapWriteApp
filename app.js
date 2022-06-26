var express = require("express");
var http = require("http");
var socketIo = require("socket.io");
var path = require("path");

var app = express();
var server = http.Server(app);
var io = socketIo(server)

var port = process.env.PORT

app.use("/public" ,express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

var draws = [];
io.on('connection', (socket) => {
    console.log('connected');

    socket.on("draw", function (data) {
        socket.broadcast.emit("draw", data);
    });

    socket.on("color", function (color) {
        socket.broadcast.emit("color", color);

    });
    socket.on("clear", function (data) {
        socket.broadcast.emit("clear", data);
        draws = [];
    });

    socket.on("lineWidth", function (width) {
        socket.broadcast.emit("lineWidth", width);
    });
});

server.listen(port, () => {
    console.log('server listening. Port:' + port);
});