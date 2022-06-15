var express = require("express");
var app = express();
var port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(port, () => {
    console.log("port:" + port);
});
