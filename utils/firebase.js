const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyB_V2UdvvXyyQmIhAWQfDay8CNgZNjwm1k",
  authDomain: "security-home-13121.firebaseapp.com",
  databaseURL: "https://security-home-13121.firebaseio.com",
  projectId: "security-home-13121",
  storageBucket: "security-home-13121.appspot.com",
  messagingSenderId: "602224877277"
};

// export const firebaseAuth = firebase.auth();
// export const firebaseDatabase = firebase.database();
// export default firebase;

firebase.initializeApp(config);
firebaseDatabase = firebase.database();

module.exports = { firebaseDatabase, firebase };
