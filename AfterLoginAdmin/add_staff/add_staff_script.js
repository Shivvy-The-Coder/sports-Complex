const firebaseConfig = {
    apiKey: "AIzaSyCaN_w3bB3VmQ1NRrdlThWvCkS6jM_fx0w",
    authDomain: "sports-complex-c71f3.firebaseapp.com",
    databaseURL: "https://sports-complex-c71f3-default-rtdb.firebaseio.com",
    projectId: "sports-complex-c71f3",
    storageBucket: "sports-complex-c71f3.appspot.com",
    messagingSenderId: "529797531168",
    appId: "1:529797531168:web:7b7914f00ffbad52031e45"
  };  
/// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
const database = firebase.database();

// Function to register a new staff member
function register() {
  // Get input field values
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const eid = document.getElementById('EID').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const joindate = document.getElementById('joindate').value;
  const phone = document.getElementById('phone').value;

  // Validate input fields
  if (!validate_field(firstname) || !validate_field(lastname) || !validate_field(eid) || !validate_email(email) || !validate_password(password) || !validate_field(joindate) ) {
    alert('Please fill all fields correctly!');
    return;
  }

  // Move on with Auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Declare user variable
      const user = userCredential.user;

      // Create Staff data
      const staff_data = {
        firstname: firstname,
        lastname: lastname,
        eid: eid,
        email: email,
        joindate: joindate,
        phone: phone,
        last_login: Date.now()
      };

      // Push staff data to Firebase Database
      database.ref('staff/' + user.uid).set(staff_data);

      // Done
      alert('Staff Registered!');
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const error_message = error.message;
      alert(error_message);
    });
}

// Validate Functions
function validate_field(field) {
  return field.trim() !== '';
}

function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}
