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
    var id = '';
  
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
          id = currentUser.uid;
          return user.getIdToken().then((idToken) => {
            return fetch("/bloodbank/sessionLogin", {
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
      db.collection('bloodbank').doc(currentUser.uid).get()
      .then(function(doc){
        if(doc.data().key === enteredKey){
          window.location.assign("/bloodbank/bloodbankhome/" + id);
        } else {
          window.location.assign("/bloodbank/bloodbanklogin");
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
  
          db.collection('bloodbank').get().then(function(snapshot){
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
   