var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('static/secure/darwin.key', 'utf8');
var certificate = fs.readFileSync('static/secure/darwin.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
var httpsServer = https.createServer(credentials, app);
var io = require('socket.io')(httpsServer);
var mongoose = require('mongoose');
var db = mongoose.connection;
var alarmSounding;
var alarmSchema = mongoose.Schema({
    title: String,
    alert: Boolean,
    hour: Number,
    min: Number
});
var Alarm = mongoose.model('Alarm', alarmSchema);
var alarm = new Alarm({
    title: "Wakeup",
    alert: true,
    hour: 12,
    min: 00
});

httpsServer.listen(8080, function () {
    console.log("Now listening on port 8080 https.");
});

mongoose.connect('mongodb://localhost/Darwin');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("CONNECTED!!");
    console.log(alarm);
    Alarm.findOne({
        title: "Wakeup"
    }, function (err, foundAlarm) {
        if (err) {
            console.log(err);
        } else {
            if (foundAlarm == null) {
                alarm.save(function (err, silence) {
                    if (err) return console.error(err);
                    console.log("saved.");
                });
            } else {
                console.log("already exists");
            }
        };
    });
});

io.on('connection', function (socket) {
    values();
    alarmFunction();

    function values() {
        Alarm.findOne({
            title: "Wakeup"
        }, function (err, foundAlarm) {
            if (err) {
                console.log(err);
            } else {
                socket.emit('values', {
                    set: foundAlarm.alert,
                    hour: foundAlarm.hour,
                    min: foundAlarm.min
                });
            };
        });
    }

    function alarmFunction() {
        var alarmInterval = setInterval(function () {
            Alarm.findOne({
                title: "Wakeup"
            }, function (err, foundAlarm) {
                if (err) {
                    console.log(err);
                } else {
                    if (foundAlarm.alert) {
                        var now = new Date();
                        var setHour = foundAlarm.hour;
                        var setMin = foundAlarm.min;
                        var realHour = now.getHours();
                        var realMin = now.getMinutes();
                        if (setHour == realHour && setMin == realMin) {
                            alarmSounding = true;
                            var alarmSoundingInterval = setInterval(function () {
                                if (alarmSounding) {
                                    clearInterval(alarmInterval);
                                    console.log("sounding");
                                    socket.emit('soundAlarm');
                                } else {
                                    clearInterval(alarmSoundingInterval);
                                    alarmFunction();
                                }
                            }, 500);
                        }
                    }
                }
            });
        }, 1000);
    }
    socket.on('alarmChange', function (data) {
        Alarm.findOne({
            title: "Wakeup"
        }, function (err, foundAlarm) {
            if (err) {
                console.log(err);
            }
            foundAlarm.hour = data.hour;
            foundAlarm.min = data.min;
            foundAlarm.alert = data.alert;
            console.log(foundAlarm);
            foundAlarm.save(function (err, silence) {
                if (err) return console.error(err);
                console.log("saved.");
                values();
            });
        });
    });
    socket.on('alarmOff', function (data) {
        console.log("alarm off");
        socket.emit("alarmOff");
        alarmSounding = false;
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
