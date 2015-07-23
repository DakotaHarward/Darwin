var socket = io.connect('http://' +window.location.hostname+ ':' +window.location.port+ '/main');
socket.on('message', function(data) {
    console.log(data);
    if (data == "connected") {
    }
});
function showSomething(id) {
    document.getElementById(id).style.display = 'block';
}
function hideSomething(id) {
    document.getElementById(id).style.display = 'none';
}
$(document).ready(function(){
    $("#alarmsettings").hide()
    $("#settingssaved").hide()
    $("#enteralarm").click(function(){
        socket.send("alarmchange: " + document.getElementById('hourfield').value + document.getElementById('minutefield').value)
        $("#alarmsettings").fadeOut( 1000, function(){
            $("#settingssaved").fadeIn( 3000, function(){
                $("#settingssaved").fadeOut(1000);
            });
            document.getElementById('hourfield').value = "";
            document.getElementById('minutefield').value = "";
        });
        $("#changealarm").fadeIn(1000);
    });
    $("#cancelalarm").click(function(){
        $("#alarmsettings").fadeOut( 1000, function(){
            document.getElementById('hourfield').value = "";
            document.getElementById('minutefield').value = "";
        });
        $("#changealarm").fadeIn(1000);
    });
    $("#changealarm").click(function(){
        $("#changealarm").fadeOut(1000);
        $("#alarmsettings").fadeIn(1000);
    });
});