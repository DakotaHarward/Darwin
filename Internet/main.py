from flask import Flask, render_template
from flask.ext.socketio import SocketIO, send, emit
import os
app = Flask(__name__)
socketio = SocketIO(app)

@socketio.on('appConnected')
def app_connected(json):
    print('received json: ' + str(json))

@socketio.on('connect', namespace="/main")
def startSocket():
    print "test message2"
@app.route('/')
def load():
    return render_template("index.html")

if __name__ == "__main__":
    socketio.run(app, "localhost", 80)