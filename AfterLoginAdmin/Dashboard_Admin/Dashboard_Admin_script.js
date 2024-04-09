const firebaseConfig = {
  apiKey: "AIzaSyCaN_w3bB3VmQ1NRrdlThWvCkS6jM_fx0w",
  authDomain: "sports-complex-c71f3.firebaseapp.com",
  databaseURL: "https://sports-complex-c71f3-default-rtdb.firebaseio.com",
  projectId: "sports-complex-c71f3",
  storageBucket: "sports-complex-c71f3.appspot.com",
  messagingSenderId: "529797531168",
  appId: "1:529797531168:web:7b7914f00ffbad52031e45"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
// Reference to the Firebase authentication
const auth = firebase.auth();

// Function to handle logout
function logout() {
  auth.signOut().then(() => {
    alert("LOGGED OUT")
    window.location.href = "../../index.html"; // Redirect to the main screen
  }).catch((error) => {
    // An error happened.
    console.error("Logout error:", error);
  });
}

// Attach click event listener to the logout button
var logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", logout);






// Function to display user details
function displayUserDetails(user) {
  // Access the container where you want to display the user details
  var userDetailsContainer = document.getElementById("user-details");

  


  var lastLoginTimestamp = user.last_login;
  var lastLoginDate = new Date(lastLoginTimestamp);
  var formattedDate = lastLoginDate.toLocaleString(); 

  // Create HTML elements to display the user details
  var userDetailsHTML = `
  <h5>Welcome, ${user.firstname}!</h5>
  <p><b>Name: </b> <span style="color: rgb(82, 81, 81);"> ${user.firstname} ${user.lastname}</p>
  <p><b>Email:</b> <span style="color: rgb(82, 81, 81);">${user.email}</p>
  <p><b>Join Date:</b> <span style="color: rgb(82, 81, 81);">${user.joindate}</p>    
  <p><b>Phone:</b> <span style="color: rgb(82, 81, 81);">${user.phone}</p>
  <p><b>Last Login:</b> <span style="color: rgb(82, 81, 81);">${formattedDate}</span></p>
`;


  // Update the HTML content with user details
  userDetailsContainer.innerHTML = userDetailsHTML;
}

// Function to get user details after login
function getUserDetails() {
  // Check if a user is logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      // Retrieve user details from the database
      database.ref('users/' + user.uid).once('value').then(function(snapshot) {
        var userDetails = snapshot.val();
        // Display user details
        displayUserDetails(userDetails);
      });
    } else {
      // No user is signed in
      console.log('No user is signed in.');
    }
  });
}

getUserDetails();



const fileInput = document.getElementById('profilePictureInput');
const profilePicture = document.getElementById('profilePicture');

// Listen for file selection
fileInput.addEventListener('change', handleFileUpload);



function handleFileUpload(event) {
  const file = event.target.files[0];
  const user = firebase.auth().currentUser;

  if (!user) {
      console.error('No user signed in.');
      return;
  }

  const userEmail = user.email; // Get user's email

  const fileName = userEmail ? `${userEmail}_${file.name}` : file.name; // Concatenate user's email with file name

  const storageRef = firebase.storage().ref();
  const uploadTask = storageRef.child('images/' + fileName).put(file);

  uploadTask.on('state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          alert('Upload is ' + progress + '% done'+"reload for confrimation");
      },
      (error) => {
          console.error('Error uploading image:', error);
      },
      () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              const uid = user.uid;
              firebase.database().ref('users/' + uid + '/profilePicture').set(downloadURL);
          });
      }
  );
}

function displayProfilePicture() {
  const user = firebase.auth().currentUser;
  if (!user) {
      console.error('No user signed in.');
      return;
  }
  
  const uid = user.uid;
  const profilePictureRef = firebase.database().ref('users/' + uid + '/profilePicture');

  // Fetch the profile picture URL from the database
  profilePictureRef.once('value')
      .then((snapshot) => {
          const profilePictureUrl = snapshot.val();
          if (profilePictureUrl) {
              // Display the profile picture
              document.getElementById('profile-picture').src = profilePictureUrl;
          } else {
              console.error('Profile picture URL not found.');
          }
      })
      .catch((error) => {
          console.error('Error fetching profile picture URL:', error);
      });
}

// Call the function to display the profile picture when the page loads
window.addEventListener('load', () => {
  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          displayProfilePicture();
      } else {
          console.error('No user signed in.');
      }
  });
});


// Function to display staff names along with their UIDs
function displayStaff() {
  // Access the container where you want to display the staff details
  var staffContainer = document.getElementById("staff-names");

  // Reference to the staff data in the database
  var staffRef = firebase.database().ref('staff');

  // Fetch staff data from the database
  staffRef.once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var staffData = childSnapshot.val();
      var staffName = staffData.firstname;
      var staffEID = staffData.eid; // Assuming 'eid' is the field for Employee ID
      
      // Create HTML elements to display staff names and Employee IDs
      var staffHTML = `<div><p>Name: ${staffName}</p><p>Employee ID: ${staffEID}</p>  <hr></div>`;

      // Append staff HTML to the container
      staffContainer.innerHTML += staffHTML;
    });
  });
}

// Call the function to display staff when the page loads
window.addEventListener('load', () => {
  displayStaff();
});

// Function to display work updates
// function displayWorkUpdates() {
//   const updatesRef = firebase.database().ref('updates');

//   updatesRef.once('value', function(snapshot) {
//     const updates = snapshot.val();
//     if (updates) {
//       // Access the container where you want to display the updates
//       const updatesContainer = document.getElementById("updates-container");

//       // Clear previous content
//       updatesContainer.innerHTML = '';

//       // Iterate through each update and display it
//       for (const key in updates) {
//         if (updates.hasOwnProperty(key)) {
//           const update = updates[key];

//           // Create HTML elements to display the update
//           const updateHTML = `
//             <div>
//               <p><b>Work ID:</b> ${key}</p>
//               <p><b>Status:</b> ${update.status}</p>
//               <p><b>Description:</b> ${update.description}</p>
//             </div>
//             <hr>
//           `;

//           // Append the update HTML to the container
//           updatesContainer.innerHTML += updateHTML;
//         }
//       }
//     } else {
//       console.log("No work updates found.");
//       // Handle case where no updates are found
//     }
//   }, function(error) {
//     console.error("Error fetching work updates: ", error);
//     // Handle error
//   });
// }

// Function to display work updates
// Function to display work updates
function displayWorkUpdates() {
  const updatesRef = firebase.database().ref('updates');

  updatesRef.once('value', function(snapshot) {
    const updates = snapshot.val();
    if (updates) {
      // Access the container where you want to display the updates
      const updatesContainer = document.getElementById("updates-container");

      // Clear previous content
      updatesContainer.innerHTML = '';

      // Iterate through each update and display it
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          const update = updates[key];
          // Check if the 'work1' object exists
          if (update.hasOwnProperty('work1')) {
            const work = update.work1;
            // Accessing status and update fields
            const status = work.status;
            const updateText = work.update;

            // Create HTML elements to display the update
            const updateHTML = `
              <div>
                <p><b>Status:</b> ${status}</p>
                <p><b>Update:</b> ${updateText}</p>
              </div>
              <hr>
            `;

            // Append the update HTML to the container
            updatesContainer.innerHTML += updateHTML;
          } else {
            console.log("No 'work1' object found for update:", key);
          }
        }
      }
    } else {
      console.log("No work updates found.");
      // Handle case where no updates are found
    }
  }, function(error) {
    console.error("Error fetching work updates: ", error);
    // Handle error
  });
}
