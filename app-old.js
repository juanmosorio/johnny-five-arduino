const five = require("johnny-five");
const { firebaseDatabase } = require('./utils/firebase');
const io = require('socket.io-client');

const board = new five.Board();

const socket = io('http://localhost:3000');

board.on("ready", () => {
  let ledBlue = new five.Led(13);

  const servo = new five.Servo(9);
  console.log('hl');
  socket.on('openDoor', () => {
    console.log('Puerta Abiert');
  });
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
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
