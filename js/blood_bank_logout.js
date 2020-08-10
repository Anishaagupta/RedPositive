// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAz0a8V5qhAeHIRvPx0GMDWXkxmATYHhU8",
  authDomain: "redpositive-aaf52.firebaseapp.com",
  databaseURL: "https://redpositive-aaf52.firebaseio.com",
  projectId: "redpositive-aaf52",
  storageBucket: "redpositive-aaf52.appspot.com",
  messagingSenderId: "32257344806",
  appId: "1:32257344806:web:026424d7f1ddd279b7ade7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function logout() {
  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    window.location.href = "./bloodbanklogin.html";
  }).catch(function (error) {
    // An error happened.
  });
}