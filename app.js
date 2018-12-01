// Dependences
const five = require("johnny-five");
const http = require("http");
const socket = require("socket.io");
const ip = require('ip');

// utils
const { firebaseDatabase } = require('./utils/firebase');
const Notifications = require('./src/notifications/notifications');

// server
const app = http.createServer().listen(8080);
const io = socket.listen(app);

let board = new five.Board();
let servo, button;
let isOpenWihApp = false;
const idtemp = 'vTa7l8weaJfC17KMekYP6ereAY52';

const openDoor = ({ isOpen }) => {
  isOpenWihApp = isOpen;
  servo.to(90);
}

const closeDoor = ({ isOpen }) => {
  isOpenWihApp = isOpen;
  servo.to(0);
}

board.on("ready", () => {

  button = new five.Button(2);
  servo = new five.Servo(9);
  servo.to(0);

  board.repl.inject({
    button: button
  });

  button.on("down", () => {
    io.sockets.emit('closingDoor', {
      isClosed: true
    });
    closeDoor({ isOpen: false });
  });

  button.on("up", () => {
    if (!isOpenWihApp) {
      Notifications.sendNotification();
      io.sockets.emit('alert', {
        isAlert: true
      });
    } else {
      io.sockets.emit('isOpenNow', { isOpen: true });
    }
  });

  io.sockets.on("connection", (client) => {
    console.log("Socket Connected");
    
    client.emit('ip', ip.address());
    
    client.on('openDoor', (data) => openDoor(data));

    client.on('disconnect', () => {
      console.log('User disconnected');
    });

  });

  firebaseDatabase.ref(`home/${ idtemp }/door/`).on('value', (snapshot) => {
    const { isOpen } = snapshot.val();
    if (isOpen) return openDoor({ isOpen });
  });
  
});
