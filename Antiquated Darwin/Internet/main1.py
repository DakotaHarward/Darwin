from flask import Flask, render_template
from flask.ext.socketio import SocketIO, send, emit
from twisted.internet.protocol import Protocol, Factory
from twisted.internet import reactor
from threading import Thread
import RPi.GPIO as GPIO
import datetime
import os

GPIO.setmode(GPIO.BCM) ## Use board pin numbering
##GPIO.setup(7, GPIO.OUT) ## Setup GPIO Pin 7 to OUT
GPIO.setup(2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
reset = True

def twistedServer():
    def RaspberryLight(Protocol):
	def connectionMade(self):
		#self.transport.write("""connected""")
		self.factory.clients.append(self)
		print "clients are ", self.factory.clients

	def connectionLost(self, reason):
		print "connection lost ", self.factory.clients
		self.factory.clients.remove(self)


	def dataReceived(self, data):
                        global reset
			msg = ""

##			if (data == 'P7H'):
##				msg = "Pin 7 is now High"
##				GPIO.output(7, True)
##
##			elif (data == 'P7L'):
##				msg = "Pin 7 is now Low"
##				GPIO.output(7, False)

			if (data == 'test'):
                            msg = "YAY THE PHONE SENT A MESSAGE as;dfjasl;ldjflkasdjfasjdflsajflksajdlfjasdkfjas;l"
                        elif (data == 'reset door'):
                            reset = True
                            print "reset door"


			print msg

    factory = Factory()
    factory.protocol = RaspberryLight
    factory.clients = []
    reactor.listenTCP(7777, factory)
    print "RaspberryLight server started"
    reactor.run()

def socketServer():			
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
        return render_template("betaIndex.html")
    @app.route('/launch')
    def loadLaunch():
        return render_template("testLaunch.html")

    if __name__ == "__main__":
        socketio.run(app, "localhost", 80)

twisted = Thread(target=twistedServer)
twisted.start()

socket = Thread(target=socketServer)
socket.start()

##def doorSensor():
##    global reset
##    while True:
##        if reset == True:
##            if GPIO.input(2) == GPIO.LOW:
##                doorLog = open("Door_Log.txt", "w")
##                doorLog.write("Door Opened At: " + datetime.datetime.strftime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"))
##                doorLog.close()
##                reset = False
##            else:
##                print "it's closed"
##
##door = Thread(target=doorSensor)
##door.daemon = True
##door.start()
