var socket = io.connect('http://' +window.location.hostname+ ':' +window.location.port+ '/main');
socket.on('message', function(data) {
    console.log(data);
    if (data == "connected") {
    }
});

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;

recognition.onstart = function() {
    recognizing = true;
    console.log("started the speech thing");
};

recognition.onerror = function(event) {
    console.log(event.error);
};

recognition.onend = function() {
    console.log("stoped the speech thing");
};

 recognition.onresult = function(event) {
    var interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
};
function showSomething(id) {
    document.getElementById(id).style.display = 'block';
}
function hideSomething(id) {
    document.getElementById(id).style.display = 'none';
}
$(document).ready(function(){
    
});