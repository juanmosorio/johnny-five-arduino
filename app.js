const five = require("johnny-five");
const { firebaseDatabase } = require('./utils/firebase');
const io = require('socket.io-client');

const board = new five.Board();

const socket = io('http://192.168.1.2:3000');

board.on("ready", () => {
  let ledBlue = new five.Led(13);

  const servo = new five.Servo(9);

  socket.on('openDoor', () => {
    console.log('Puerta Abiert');
  });
  
  firebaseDatabase.ref('leds/')
    .on('value', snapshot => {
      const { blue, red, yellow } = snapshot.val();
      try {
        if (blue) {
          ledBlue.on();
          servo.to(90);
          setTimeout(() => servo.to(0), 1000);
        } else {
          ledBlue.off();
          servo.to(0);
        }
      } catch (error) {
        console.log(error);
      }
    });

});
