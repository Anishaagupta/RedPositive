const express = require('express');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
//const hospitalRoutes = require('./routes/hospital');

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 4000;
const app = express();


var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://redpositive-aaf52.firebaseio.com"
});


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//app.use(bodyParser({ extended: false }));
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
}); 

app.get('/', (req, res) => {
    res.render("index");
});

//app.use("/hospital", hospitalRoutes);



app.get("/hospital/hospitallogin", (req, res) => {
  res.render("hospitallogin") 
});


app.get("/hospital/hospitalregister", (req, res) => {
   res.render("hospitalregister") 
});

app.get("/hospital/hospitalhome", (req, res) =>{
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      res.render("hospital_home_1");
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect("/hospital/hospitallogin");
    });
});

app.post("/hospital/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/hospital/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/hospital/hospitallogin");
});


app.post('/hospital/sendEmail',(req, res) => {
  const email = req.body.signupEmail.toString();
  const key = req.body.key.toString();

  const output = `
    <h2>Hey ${email}, here is your unique key.</h2>
    <h3>Use it to login to your RedPositive Account.</h3>
    <h3>${key}</h3>
    <h4><i>For security reasons, we advise you not to share it with anyone.</i></h4>
  `;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "redpositive2020@gmail.com",
      pass: "blank"
    }
  });

  let mailOptions = {
    from: '"RedPositive Services" <redpositive2020@gmail.com>',
    to: email,
    subject: 'Login Key',
    text: 'Here is your login key.',
    html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.end(JSON.stringify({ status: "success"}));
  });  
});



// ========================================================
// BLOOD BANK ROUTES
// ========================================================


app.get("/bloodbank/bloodbanklogin", (req, res) => {
  res.render("bloodbanklogin") 
});


app.get("/bloodbank/bloodbankregister", (req, res) => {
   res.render("bloodbankregister") 
});

app.get("/bloodbank/bloodbankhome/:id", (req, res) =>{
  const sessionCookie = req.cookies.session || "";

  admin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then(() => {
      res.render("bloodbank_db", { user: req.params.id});
    })
    .catch((error) => {
      console.log(error.message);
      res.redirect("/bloodbank/bloodbanklogin");
    });
});

app.get("/bloodbank/bloodcollection/:id", (req, res) => {
  res.render("bloodbank_collection", { user: req.params.id });
});


app.post("/bloodbank/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();

  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

app.get("/bloodbank/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/bloodbank/bloodbanklogin");
});


app.post('/bloodbank/sendEmail',(req, res) => {
  const email = req.body.signupEmail.toString();
  const key = req.body.key.toString();

  const output = `
    <h2>Hey ${email}, here is your unique key.</h2>
    <h3>Use it to login to your RedPositive Account.</h3>
    <h3>${key}</h3>
    <h4><i>For security reasons, we advise you not to share it with anyone.</i></h4>
  `;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "redpositive2020@gmail.com",
      pass: "blank"
    }
  });

  let mailOptions = {
    from: '"RedPositive Services" <redpositive2020@gmail.com>',
    to: email,
    subject: 'Login Key',
    text: 'Here is your login key.',
    html: output
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.end(JSON.stringify({ status: "success"}));
  });  
});


app.listen(PORT, console.log("SERVER RUNNING.."));