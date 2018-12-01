const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyAsLTCtA3Uw76oqGSyIbv1lZBi7CSRBva8",
  authDomain: "securityhome-a47bf.firebaseapp.com",
  databaseURL: "https://securityhome-a47bf.firebaseio.com",
  projectId: "securityhome-a47bf",
  storageBucket: "securityhome-a47bf.appspot.com",
  messagingSenderId: "167482981498"
}

firebase.initializeApp(config);
firebaseDatabase = firebase.database();

module.exports = { firebaseDatabase };
