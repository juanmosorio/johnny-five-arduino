const OneSignal = require('onesignal-node');

const myClient = new OneSignal.Client({    
  userAuthKey: 'NWZiNTI1ODYtM2E2Mi00ODU5LWJjM2QtN2Q2ZTAzMDg1N2Ex',
  app: {
    appAuthKey: 'ODBlYTM4ZmQtNmY0Zi00NGI4LThiODgtNTY2ZTkyNDU0YmQ5',
    appId: '51fd17be-a717-4b84-89a9-746b4ca65c70'
  }
});

const firstNotification = new OneSignal.Notification({    
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

const sendNotification = () => {
  // send this notification to All Users except Inactive ones    
  myClient.sendNotification(firstNotification, (err, httpResponse, data) => {
    if (err) {    
      console.log('Something went wrong...');    
    } else {    
      console.log(data, httpResponse.statusCode);    
    }    
  });   
}

module.exports = { sendNotification };