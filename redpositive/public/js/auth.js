const db = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

var currentUser = null;

document.getElementById('signup')
    .addEventListener('click', function(e) {
        e.preventDefault();
        var signupEmail = document.getElementById("signupEmail").value;
        var signupPassword = document.getElementById("signupPassword").value;
        var confirmPassword = document.getElementById("confirmpassword").value;
    
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})");
        var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})");
        var weakRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.{10,})");
        var capitalWeak = new RegExp("^(?=.*[A-Z])(?=.{10,})");
        var smallWeak = new RegExp("^(?=.*[a-z])(?=.{10,})");
    
        if(signupPassword.length < 10){
            return window.alert("Password length too short!");
        } else if(signupPassword.length >= 10){
            if(!strongRegex.test(signupPassword)){
                if(mediumRegex.test(signupPassword)){
                    return window.alert("Password strength is medium!");
                } else if(weakRegex.test(signupPassword) || smallWeak.test(signupPassword) || capitalWeak.test(signupPassword)){
                    return window.alert("Password strength is weak!");
                } 
            }
        }
    
        if(signupPassword != confirmPassword){
            return window.alert("Passwords do not match!");
        }
    
        firebase
            .auth()
                .createUserWithEmailAndPassword(signupEmail, signupPassword)
                .then(({user}) => {
                    currentUser = user;
                    return user.getIdToken().then((idToken) => {
                        return fetch("/hospital/sessionLogin", {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                "Content-Type": "application/json",
                                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                            },
                            body: JSON.stringify({idToken})
                        });
                    });
                })
                .then(() => {
                    return firebase.auth().signOut()
                })
                .then(() => {
                    signupDataStore();
                    const key = currentUser.uid.slice(0,15);
                    return fetch("/hospital/sendEmail", {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            "Content-Type": "application/json",
                            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                        },
                        body: JSON.stringify({signupEmail, key})
                    });
                })
                .then(() => {
                    window.location.assign("/hospital/hospitalhome");
                })
                return false;
    })

function signupDataStore(){
    var entityType = document.getElementById("etype").value;
    var signupName = document.getElementById("ename").value;
    var reg = document.getElementById("ereg").value;
    var contact = document.getElementById("enum").value;
    var iso = document.getElementById("eiso").value;
    var managerName = document.getElementById("emanager").value;
    
    db.collection('hospital_and_clinic').doc(currentUser.uid).set({
        key: currentUser.uid.slice(0,15),
        entityType: entityType,
        name: signupName,
        contact: contact,
        regNum: reg,
        iso:  iso,
        managerName: managerName
    })
    .then(function(){
        console.log("Data should be saved!");
    })
    .catch(function(err){
        console.log(err.message);
    })
}
    

    
/*
firebase.auth().onAuthStateChanged(function(user) {
    if(user){
        setTimeout(() => {
            window.location.href = "../public/waiting.html";
        }, 3000);
    }
});



function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;


    firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(function(error){
            var errorMessage = error.message;

            window.alert("Error: " + errorMessage);
        });
}

function proceed(){
    var verifyUser = firebase.auth().currentUser;
    if(verifyUser.emailVerified){
        window.location.href = "../public/hospital_home_1.html";
    } else {
        window.alert("Email still not verified!");
    }
}


function signup(e) {
    var signupEmail = document.getElementById("signupEmail").value;
    var signupPassword = document.getElementById("signupPassword").value;
    var confirmPassword = document.getElementById("confirmpassword").value;

    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})");
    var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})");
    var weakRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.{10,})");
    var capitalWeak = new RegExp("^(?=.*[A-Z])(?=.{10,})");
    var smallWeak = new RegExp("^(?=.*[a-z])(?=.{10,})");

    if(signupPassword.length < 10){
        return window.alert("Password length too short!");
    } else if(signupPassword.length >= 10){
        if(!strongRegex.test(signupPassword)){
            if(mediumRegex.test(signupPassword)){
                return window.alert("Password strength is medium!");
            } else if(weakRegex.test(signupPassword) || smallWeak.test(signupPassword) || capitalWeak.test(signupPassword)){
                return window.alert("Password strength is weak!");
            } 
        }
    }

    if(signupPassword != confirmPassword){
        return window.alert("Passwords do not match!");
    }

    firebase
        .auth()
            .createUserWithEmailAndPassword(signupEmail, signupPassword)
            .then(function(){
                signupDataStore();
            })
                .catch(function(err) {
                    var errorMessage = err.message;
                
                    window.alert(errorMessage);
                });
                              
}



function forgot() {
    var auth = firebase.auth();
    var forgotEmail = document.getElementById("forgotEmail").value;

    if(forgotEmail != ""){
        auth.sendPasswordResetEmail(forgotEmail).then(function(){
            window.alert("An Email with instructions has been sent to " + forgotEmail);
        })
        .catch(err => window.alert("Error is: " + err.message));
    } else {
        window.alert("Please provide a valid Email address.");
    }
}




*/