const five = require("johnny-five");
const http = require("http");
const socket = require("socket.io");
const ip = require('ip');

const { firebaseDatabase } = require('./utils/firebase');
const { sendNotification } = require('./src/notifications/notifications');

const app = http.createServer().listen(8080);
const io = socket.listen(app);

let led;
let board = new five.Board();

// permite saber si la puerta es abierta pormedio de la app
let isOpenWihApp = false;

const openDoor = (data) => {
  isOpenWihApp = true;
  console.log({ data: data });
  // servo.to(90);
  // setTimeout(() => servo.to(0), 500);
  led.on();
  setTimeout(() => {
    led.off();
  }, 2000);
}

const closeDoor = (data) => {
  console.log({ data: data });
  isOpenWihApp = false;
}

board.on("ready", () => {

  let button = new five.Button(2);
  led = new five.Led(13);
  // let servo = new five.Servo(7);
  // servo.to(0);

  board.repl.inject({
    button: button
  });

  button.on("down", () => {
    console.log("Puerta cerrada!!!");
  });

  // button.on("hold", function() {
  //   console.log("hold");
  // });

  button.on("up", () => {
    if (!isOpenWihApp) {
      sendNotification();
      io.sockets.emit('alert', {
        isAlert: true,
        message: "Open door without app!!!"
      });
      console.log("Puerta abierta sin app!!!");
    } else {
      console.log("Puerta abierra con app!!!");
    }
  });

  io.sockets.on("connection", (client) => {
    console.log("Socket Connected");
    
    client.emit('ip', ip.address());
    
    client.on('openDoor', data => openDoor(data));

    client.on('closeDoor', data => closeDoor(data));

    client.on('disconnect', () => {
      console.log('User disconnected');
    });

  });

  firebaseDatabase.ref(`home/vTa7l8weaJfC17KMekYP6ereAY52/door/`)
    .on('value', (snapshot) => {
      const { isOpen, data } = snapshot.val();
      if (isOpen) return openDoor(data);
    });
  
});
