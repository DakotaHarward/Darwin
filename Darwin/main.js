var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
var db = mongoose.connection;
var alarmSchema = mongoose.Schema({
    title: String,
    alert: Boolean,
    hour: Number,
    min: Number,
    tag: String
});
var Alarm = mongoose.model('Alarm', alarmSchema);
var alarm = new Alarm({
    title: "Wakeup",
    alert: true,
    hour: 12,
    min: 00,
    tag: "AM"
});

server.listen(80, function () {
    console.log("Now listening on port 80.");
});

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("CONNECTED!!");
    console.log(alarm);
    alarm.save(function (err, silence) {
        if (err) return console.error(err);
        console.log("saved.");
    });
    Alarm.findOne({
        hour: 12,
        min: 00
    }, function (err, foundAlarm) {
        if (err) {
            console.log(err);
        }
        foundAlarm.hour = 3;
        foundAlarm.min = 14;
        console.log(foundAlarm);
    });
});

io.on('connection', function (socket) {
    socket.on('alarmChange', function (data) {
        Alarm.findOne({
            title: "Wakeup"
        }, function (err, foundAlarm) {
            if (err) {
                console.log(err);
            }
            foundAlarm.hour = data.hour;
            foundAlarm.min = data.min;
            console.log(foundAlarm);
        });
    });
});

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

app.get('/about_darwin.html', function (req, res) {
    res.sendFile(__dirname + '/templates/about_darwin.html');
});

app.get('/darwin_home.html', function (req, res) {
    res.sendFile(__dirname + '/templates/darwin_home.html');
});

app.get('/other_darwin.html', function (req, res) {
    res.sendFile(__dirname + '/templates/other_darwin.html');
});
