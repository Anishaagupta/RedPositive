/*
//var name;
//var showName = document.getElementById("showname");

firebase.auth().onAuthStateChanged(function(user) {
    if(!user) {
        window.location.href="../public/hospitallogin.html";
    }

    if(user){
        if(!user.emailVerified){
            window.location.href = "../public/waiting.html";
        }
    }
});


function logout() {
    firebase.auth().signOut().then(function(){
        window.location.href = "../public/hospitallogin.html";
    })
    .catch(function(error) {
        window.alert("Error:" + error);
    });
}*/

