const five = require("johnny-five");
const http = require("http");
const socket = require("socket.io");
const { firebaseDatabase } = require('./utils/firebase');
var OneSignal = require('onesignal-node');   



var myClient = new OneSignal.Client({    
  userAuthKey: 'NWZiNTI1ODYtM2E2Mi00ODU5LWJjM2QtN2Q2ZTAzMDg1N2Ex',
  // note that "app" must have "appAuthKey" and "appId" keys    
  app: { appAuthKey: 'ODBlYTM4ZmQtNmY0Zi00NGI4LThiODgtNTY2ZTkyNDU0YmQ5', appId: '51fd17be-a717-4b84-89a9-746b4ca65c70' }
});

// we need to create a notification to send    
var firstNotification = new OneSignal.Notification({    
  contents: {    
      en: `Alerta, se ha detectado que la puerta principal ha sido abierta sin "SecurityHome".`,
      tr: "Test mesajı"    
  }    
}); 


// set target users    
firstNotification.postBody["included_segments"] = ["Active Users"];    
firstNotification.postBody["excluded_segments"] = ["Banned Users"];    
    
// set notification parameters    
firstNotification.postBody["data"] = {"abc": "123", "foo": "bar"};    
// firstNotification.postBody["send_after"] = 'Thu Sep 24 2015 14:00:00 GMT-0700 (PDT)';  

const sendNotofication = () => {
  // send this notification to All Users except Inactive ones    
  myClient.sendNotification(firstNotification, (err, httpResponse,data) => {
    if (err) {    
        console.log('Something went wrong...');    
    } else {    
        console.log(data, httpResponse.statusCode);    
    }    
  });   
}



const app = http.createServer().listen(8080);
const io = socket.listen(app);

let led;

const openDoor = (data) => {
  console.log({data: data});
  // servo.to(90);
  // setTimeout(() => servo.to(0), 500);
  led.on();
  setTimeout(() => {
    led.off();
  }, 2000);
}

five.Board().on("ready", () => {

  led = new five.Led(13);
  // let servo = new five.Servo(7);
  // servo.to(0);

  io.sockets.on("connection", (client) => {
    console.log("Socket Connected");

    client.on('openDoor', data => openDoor(data));

    client.on('closeDoor', data => console.log('Data: ', data));

    client.on('disconnect', () => {
      console.log('User disconnected');
    });

  });

  firebaseDatabase.ref(`home/vTa7l8weaJfC17KMekYP6ereAY52/door/`)
    .on('value', (snapshot) => {
      const { isOpen, data } = snapshot.val();
      if (isOpen) return openDoor(data);
    });
  
  sendNotofication();

});
