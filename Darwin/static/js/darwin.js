var hour;
var setHour;
var setMin;
var alarmSet;
var socket = io.connect();
socket.on('soundAlarm', function (data) {
    if ($(document.getElementById('alarmButton')).is(":visible")) {
        console.log("sounding");
    } else {
        $(document.getElementById('mainStuff')).fadeOut(1000);
        $(document.getElementById('alarmButton')).fadeIn(1000);
    }
});
socket.on('values', function (data) {
    setHour = data.hour;
    setMin = data.min;
    alarmSet = data.set;
    console.log(setHour);
    console.log(setMin);
    console.log(alarmSet);
});
socket.on('alarmOff', function (data) {
   $(document.getElementById('alarmButton')).fadeOut(1000);
    $(document.getElementById('mainStuff')).fadeIn(1000);
});

function changeAlarm() {
    console.log("clicked");
    if (document.getElementById('hourfield').value == "" || document.getElementById('minutefield').value == "" || isNaN(document.getElementById('hourfield').value) || isNaN(document.getElementById('minutefield').value) || document.getElementById('hourfield').value > 12 || document.getElementById('minutefield').value > 60) {
        alert("You must enter a proper value!");
    } else {
        if ($('.pm').prop('checked')) {
            hour = (parseInt(document.getElementById('hourfield').value) + 12);
        } else {
            hour = document.getElementById('hourfield').value;
        }
        socket.emit('alarmChange', {
            alert: $('.use').prop('checked'),
            hour: hour,
            min: document.getElementById('minutefield').value
        });
        console.log($('.use').prop('checked'));
    }
}

function toggleOverlay(modalName) {
    var overlay = document.getElementById('overlay');
    var modal = document.getElementById(modalName);
    $(overlay).fadeToggle(1000);
    if ($(modal).is(":visible")) {
        $(modal)
            .css('opacity', 1)
            .slideUp('slow')
            .animate({
                opacity: 0
            }, {
                queue: false,
                duration: 'slow'
            });
    } else {
        if (modalName == "alertModal") {
            document.getElementById('minutefield').value = setMin;
            if (setHour > 12) {
                document.getElementById('hourfield').value = (parseInt(setHour) - 12);
                $('.pm').prop('checked', 'true');
            } else {
                document.getElementById('hourfield').value = setHour;
                $('.am').prop('checked', 'true');
            }
            if (alarmSet) {
                $('.use').prop('checked', 'true');
            } else {
                $('.noUse').prop('checked', 'true');
            }
        }
        $(modal)
            .css('opacity', 0)
            .slideDown('slow')
            .animate({
                opacity: 1
            }, {
                queue: false,
                duration: 'slow'
            });
    }
}

function alarmOff() {
    console.log("sent off");
    socket.emit('alarmOff');
}