const five = require("johnny-five");
const http = require("http");
const socket = require("socket.io");

const app = http.createServer().listen(4200);
const io = socket.listen(app);

let servo;

openDoor = data => {
  console.log('Data: ', data);
  servo.to(90);
  setTimeout(() => servo.to(0), 500);
}

five.Board().on("ready", () => {

  servo = new five.Servo(7);
  servo.to(0);

  io.sockets.on("connection", (client) => {
    console.log("Socket Connected");

    client.on('openDoor', data => openDoor(data));

    client.on('disconnect', () => {
      console.log('User disconnected');
    });

  });
});
