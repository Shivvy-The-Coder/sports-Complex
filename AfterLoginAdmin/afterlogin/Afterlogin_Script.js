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
  
  // Set up your login function
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
        // Get the current user
        const user = auth.currentUser;
  
        // Check if the user is authenticated
        if (user) {
          // Retrieve user data from Firebase Database
          const database_ref = database.ref('users/' + user.uid);
  
          // Fetch user data
          database_ref.once('value')
            .then(function(snapshot) {
              const userData = snapshot.val();
  
              // Check if user data exists
              if (userData) {
                // Update last login time
                database_ref.update({ last_login: Date.now() });
  
                // Display a success message
                window.location.href = '../Dashboard_Admin/Dashboard_Admin_index.html';
                alert('User Logged In!');
              } else {
                // User data not found
                alert('User data not found!');
              }
            })
            .catch(function(error) {
              // Handle errors while fetching user data
              alert('Error fetching user data: ' + error.message);
            });
        } else {
          // User not authenticated
          alert('User not authenticated!');
        }
      })
      .catch(function(error) {
        // Firebase will use this to alert of its errors
        const error_message = error.message;
        alert(error_message);
      });
  }
  
  
  // Function to validate email format
  function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
  }
  
  // Function to validate password length
  function validate_password(password) {
    return password.length >= 6;
  }
  