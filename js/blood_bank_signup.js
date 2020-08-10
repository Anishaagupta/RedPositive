
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

const shubhendu1 = firebase.firestore();

const form = document.querySelector('#bloodbanksignup');

// saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  shubhendu1.collection('BloodBankSignUp').add({
    Blood_Bank_Name: form.bname.value,
    Blood_Bank_Manager: form.mname.value,
    Blood_Bank_email: form.emailsignup.value,
    Blood_Bank_Contact_Number: form.contactsignup.value,
    Blood_Bank_ISO_Number: form.iso.value,
    Blood_Bank_Reg_Number: form.reg.value,
    Blood_Bank_Password: form.passwordsignup.value,
    Blood_Bank_Confirmpassword: form.confirmpasswordsignup.value,
  });
  form.bname.value = '';
  form.mname.value = '';
  form.emailsignup.value = '';
  form.contactsignup.value = '';
  form.iso.value = '';
  form.reg.value = '';
  form.passwordsignup.value = '';
  form.confirmpasswordsignup.value = '';
});

function createuser() {
  var email = document.getElementById("emailsignup").value;
  var password = document.getElementById("passwordsignup").value;

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: " + errorMessage);
  });
}
