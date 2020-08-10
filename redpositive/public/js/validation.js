function choice(){
    var entityType = document.getElementById("etype").value;
    
    document.getElementById("entity1").innerText = entityType;
    document.getElementById("entity2").innerText = entityType;
    document.getElementById("entity3").innerText = entityType;
    document.getElementById("entity4").innerText = entityType;
    document.getElementById("entity5").innerText = entityType;
    document.getElementById("entity6").innerText = entityType;
}

var email = document.getElementById('signupEmail');
var pwd = document.getElementById('signupPassword');
var cpwd = document.getElementById('confirmpassword');
var pwdHelp = document.getElementById('passwordHelp');
var cpwdHelp = document.getElementById('confirmpasswordHelp');


function emailValidation(){
    var atposition = email.value.indexOf("@");      
    var dotposition = email.value.lastIndexOf(".");  
    if (email.value.length == 0){
        email.style.boxShadow = "0 0 6px 1px red";
    } else if(atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.value.length){
        email.style.boxShadow = "0 0 6px 1px red";
    } else {
        email.style.boxShadow = "0 0 6px 1px green";
    }
}

function passwordValidation(){
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{10,})");
    var mediumRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})");
    var weakRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.{10,})");
    var capitalWeak = new RegExp("^(?=.*[A-Z])(?=.{10,})");
    var smallWeak = new RegExp("^(?=.*[a-z])(?=.{10,})");
    if (pwd.value.length < 10){
        pwd.style.boxShadow = "0 0 6px 1px red";
        pwdHelp.innerHTML = "Too Short";
    } else if(pwd.value.length >= 10){
        if(strongRegex.test(pwd.value)){
            pwd.style.boxShadow = "0 0 6px 1px green";
            pwdHelp.innerHTML = "Strong";
        } else if(mediumRegex.test(pwd.value)){
            pwd.style.boxShadow = "0 0 6px 1px #999900";
            pwdHelp.innerHTML = "Medium";
        } else if(weakRegex.test(pwd.value) || smallWeak.test(pwd.value) || capitalWeak.test(pwd.value)){
            pwd.style.boxShadow = "0 0 6px 1px orange";
            pwdHelp.innerHTML = "Weak";
        } 
    }
}


function cpasswordValidation(){
    if (cpwd.value.length < 10){
        cpwd.style.boxShadow = "0 0 6px 1px red";
        cpwdHelp.style.display = "block";
        cpwdHelp.innerHTML = "Passwords do not match.";
    } else {
        if(cpwd.value !== pwd.value){
            cpwd.style.boxShadow = "0 0 6px 1px red";
            cpwdHelp.style.display = "block";
            cpwdHelp.innerHTML = "Passwords do not match.";
        }
        else{
            cpwd.style.boxShadow = "0 0 6px 1px green";
            cpwdHelp.style.display = "none";
            cpwdHelp.innerHTML = "";
        }
    }
}