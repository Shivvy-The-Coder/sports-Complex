// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaN_w3bB3VmQ1NRrdlThWvCkS6jM_fx0w",
  authDomain: "sports-complex-c71f3.firebaseapp.com",
  projectId: "sports-complex-c71f3",
  storageBucket: "sports-complex-c71f3.appspot.com",
  messagingSenderId: "529797531168",
  appId: "1:529797531168:web:7b7914f00ffbad52031e45"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const age = document.getElementById('age').value;
  const phone = document.getElementById('phone').value;
  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is invalid!');
    return;
  }
  if (!validate_field(firstname) || !validate_field(lastname) || !validate_field(age) || !validate_field(phone)) {
    alert('One or More Extra Fields is invalid!');
    return;
  }
 
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      // Declare user variable
      const user = userCredential.user;

      // Add this user to Firebase Database
      const database_ref = database.ref();

      // Create User data
      const user_data = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        age: age,
        phone: phone,
        last_login: Date.now()
      };

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data);

      // Done
      alert('User Created!');
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const error_message = error.message;
      alert(error_message);
    });
}

// Set up our login function
function login() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is invalid!');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      const user = auth.currentUser;

      // Add this user to Firebase Database
      const database_ref = database.ref();

      // Create User data
      const user_data = {
        last_login: Date.now()
      };

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data);

      // Done
      alert('User Logged In!');
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      const error_message = error.message;
      alert(error_message);
    });
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  return password.length >= 6;
}

function validate_field(field) {
  return field.trim() !== '';
}
