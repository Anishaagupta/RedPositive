// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyAz0a8V5qhAeHIRvPx0GMDWXkxmATYHhU8',
  authDomain: 'redpositive-aaf52.firebaseapp.com',
  databaseURL: 'https://redpositive-aaf52.firebaseio.com',
  projectId: 'redpositive-aaf52',
  storageBucket: 'redpositive-aaf52.appspot.com',
  messagingSenderId: '32257344806',
  appId: '1:32257344806:web:026424d7f1ddd279b7ade7',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var bloodBankdb = firebase.firestore();

//saving data

const form = document.querySelector('#donate');

let name = document.querySelector('#name');
let fname = document.querySelector('#fname');
let contact = document.querySelector('#contact');
let age = document.querySelector('#age');
let address = document.querySelector('#address');
let DOB = document.querySelector('#DOB');
let email = document.querySelector('#email');
let HB = document.querySelector('#HB');
let FFP = document.querySelector('#FFP');
let BP = document.querySelector('#BP');
let PC = document.querySelector('#PC');
let bloodGroup = document.querySelector('#bloodGroup');
let whiteBlood = document.querySelector('#whiteBlood');
let weight = document.querySelector('#weight');
let cryp = document.querySelector('#cryp');
let gender = document.querySelector('#gender');

form.addEventListener('click', function (e) {
  e.preventDefault();
  let inputname = name.value;
  let inputfname = fname.value;
  let inputage = age.value;
  let inputaddress = address.value;
  let inputDOB = DOB.value;
  let inputemail = email.value;
  let inputHB = HB.value;
  let inputPC = PC.value;
  let inputFFP = FFP.value;
  let inputBP = BP.value;
  let inputcryp = cryp.value;
  let inputbloodGroup = bloodGroup.value;
  let inputwhiteBlood = whiteBlood.value;
  let inputcontact = contact.value;
  let inputgender = gender.value;
  let inputweight = weight.value;

  bloodBankdb
    .collection('bloodbank')
    .doc('IEhfo6IS9EfJTEhmFFXZNRo2m0E3')
    .collection('bloodDonars')
    .add({
      Name: inputname,
      FatherName: inputfname,
      Contact: inputcontact,
      Age: inputage,
      DOB: inputDOB,
      FFP: inputFFP,
      HB: inputHB,
      PC: inputPC,
      Blood_group: inputbloodGroup,
      WhiteBlood: inputwhiteBlood,
      Address: inputaddress,
      Email: inputemail,
      Cryp: inputcryp,
      BP: inputBP,
      Gender: inputgender,
      Weight: inputweight,
    })
    .then(function () {
      console.log('Data saved');
    })
    .catch(function (event) {
      console.log('error', event);
    });
  timedRefresh(1000);
});

function timedRefresh(time) {
  setTimeout('location.reload(true);', time);
}

// reading data
bloodBankdb
  .collection('bloodbank')
  .doc('IEhfo6IS9EfJTEhmFFXZNRo2m0E3')
  .collection('bloodDonars')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      renderAccount(doc);
      console.log(doc.data());
    });
  });

donor_ID = 1;
const accountList = document.querySelector('#donor-table');
function renderAccount(doc) {
  let id = document.createElement('td');
  let tr = document.createElement('tr');
  // let td_DonorID = document.createElement('td');
  let td_Email = document.createElement('td');
  let td_FatherName = document.createElement('td');
  let td_Name = document.createElement('td');
  let td_Address = document.createElement('td');
  let td_BloodGroup = document.createElement('td');
  let td_BP = document.createElement('td');
  let td_FFP = document.createElement('td');
  let td_HB = document.createElement('td');
  let td_Contact = document.createElement('td');
  let td_Weight = document.createElement('td');
  let td_WhiteBlood = document.createElement('td');
  let td_DOB = document.createElement('td');
  let td_Cryp = document.createElement('td');
  let td_Gender = document.createElement('td');
  let td_Age = document.createElement('td');
  let td_PC = document.createElement('td');
  let td_edit = document.createElement('td');

  tr.setAttribute('data-id', doc.id);

  id.textContent = donor_ID;
  td_Name.textContent = doc.data().Name;
  td_FatherName.textContent = doc.data().FatherName;
  td_DOB.textContent = doc.data().DOB;
  td_Age.textContent = doc.data().Age;
  td_Gender.textContent = doc.data().Gender;
  td_Address.textContent = doc.data().Address;
  td_Contact.textContent = doc.data().Contact;
  td_Email.textContent = doc.data().Email;
  td_Weight.textContent = doc.data().Weight;
  td_HB.textContent = doc.data().HB;
  td_BP.textContent = doc.data().BP;
  td_BloodGroup.textContent = doc.data().Blood_group;
  td_WhiteBlood.textContent = doc.data().WhiteBlood;
  td_FFP.textContent = doc.data().FFP;
  td_PC.textContent = doc.data().PC;
  td_Cryp.textContent = doc.data().Cryp;

  tr.appendChild(id);
  tr.appendChild(td_Name);
  tr.appendChild(td_FatherName);
  tr.appendChild(td_DOB);
  tr.appendChild(td_Age);
  tr.appendChild(td_Gender);
  tr.appendChild(td_Address);
  tr.appendChild(td_Contact);
  tr.appendChild(td_Email);
  tr.appendChild(td_Weight);
  tr.appendChild(td_BP);
  tr.appendChild(td_HB);
  tr.appendChild(td_BloodGroup);
  tr.appendChild(td_WhiteBlood);
  tr.appendChild(td_FFP);
  tr.appendChild(td_PC);
  tr.appendChild(td_Cryp);

  accountList.appendChild(tr);
  donor_ID = donor_ID + 1;
}
///////////////////////////////////////
document.getElementById('add-btn').addEventListener('click', function () {
  document.querySelector('.bg-modal').style.display = 'flex';
});
document.querySelector('.close').addEventListener('click', function () {
  document.querySelector('.bg-modal').style.display = 'none';
});
// document.querySelector('donate').addEventListener('click', function () {
//   document.querySelector('.bg-modal').style.display = 'none';
// });
