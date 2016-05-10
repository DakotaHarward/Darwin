var socket = io.connect();
socket.on('soundAlarm', function (data) {
    console.log("SOUNDING THE ALARM!!!!!!!!!!!!!!!!!!!");
});

function changeAlarm() {
    console.log("clicked");
    socket.emit('alarmChange', {
        hour: document.getElementById('hourfield').value,
        min: document.getElementById('minutefield').value
    });
}
