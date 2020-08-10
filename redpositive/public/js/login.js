window.addEventListener("DOMContentLoaded", () => {

  var firebaseConfig = {
   apiKey: "AIzaSyAz0a8V5qhAeHIRvPx0GMDWXkxmATYHhU8",
   authDomain: "redpositive-aaf52.firebaseapp.com",
   databaseURL: "https://redpositive-aaf52.firebaseio.com",
   projectId: "redpositive-aaf52",
   storageBucket: "redpositive-aaf52.appspot.com",
   messagingSenderId: "32257344806",
   appId: "1:32257344806:web:c51d70f9081211bdb7ade7"
  } ;

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

  var currentUser = null;

  document
  .getElementById("login")
  .addEventListener("click", (event) => {
      event.preventDefault();
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
  
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        currentUser = user;
        return user.getIdToken().then((idToken) => {
          return fetch("/hospital/sessionLogin", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ idToken }),
          });
        });
      })
      .then(() => {
        return firebase.auth().signOut();
      })
      .then(() => {
        checkKey();
      });
    return false;
  });

  function checkKey(){
    var enteredKey = document.getElementById("key").value;
    db.collection('hospital_and_clinic').doc(currentUser.uid).get()
    .then(function(doc){
      if(doc.data().key === enteredKey){
        window.location.assign("/hospital/hospitalhome");
      } else {
        window.location.assign("/hospital/hospitallogin");
      }
    })
   }


   document
    .getElementById("forgot")
    .addEventListener("click", (event) => {
        event.preventDefault();
        var forgotEmail = document.getElementById("forgotpasswordemail").value;
        var forgotKey = document.getElementById("forgotpasswordkey").value;

        var found;

        db.collection('hospital_and_clinic').get().then(function(snapshot){
          snapshot.forEach(function(doc){
            if(doc.data().key ===  forgotKey){
              found = true;
              if(forgotEmail != ""){
                firebase
                  .auth()
                      .sendPasswordResetEmail(forgotEmail)
                          .then(() => {
                              window.alert("A password reset mail has been sent to " + forgotEmail);
                              location.reload();
                          })
                          .then(() => {
                              return firebase.auth().signOut();
                          })
                          return false;
                  }
            }
          });
          if(found == false){
            window.alert("Invalid Key!");
          }
        });
      });
});
 