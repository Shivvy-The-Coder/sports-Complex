const firebaseConfig = {
    apiKey: "AIzaSyCaN_w3bB3VmQ1NRrdlThWvCkS6jM_fx0w",
    authDomain: "sports-complex-c71f3.firebaseapp.com",
    databaseURL: "https://sports-complex-c71f3-default-rtdb.firebaseio.com",
    projectId: "sports-complex-c71f3",
    storageBucket: "sports-complex-c71f3.appspot.com",
    messagingSenderId: "529797531168",
    appId: "1:529797531168:web:7b7914f00ffbad52031e45"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Function to display staff details on the page
function displayStaffDetails(staff) {
    // Access the container where you want to display the staff details
    var staffDetailsContainer = document.getElementById("staff-details");

    var lastLoginTimestamp = staff.last_login;
    var lastLoginDate = new Date(lastLoginTimestamp);
    var formattedDate = lastLoginDate.toLocaleString(); 

    // Create HTML elements to display the staff details
    var staffDetailsHTML = `
        <h5>Welcome, ${staff.firstname}!</h5>
        <p><b>Name: </b> <span style="color: rgb(82, 81, 81);">${staff.firstname} ${staff.lastname}</p>
        <p><b>Email:</b> <span style="color: rgb(82, 81, 81);">${staff.email}</p>
        <p><b>EID:</b> <span style="color: rgb(82, 81, 81);">${staff.eid}</p>
        <p><b>Phone:</b> <span style="color: rgb(82, 81, 81);">${staff.phone}</p>
        <p><b>Join Date:</b> <span style="color: rgb(82, 81, 81);">${staff.joindate}</p>
        <p><b>Last Login:</b> <span style="color: rgb(82, 81, 81);">${formattedDate}</span></p>
    `;

    // Update the HTML content with staff details
    staffDetailsContainer.innerHTML = staffDetailsHTML;

    // Call other functions
    displayLoadingPrompt();
    displayWorkDetails();
}

// Function to display loading prompt
function displayLoadingPrompt() {
    alert("Assigned work is getting loaded");
}


// Function to display work details
function displayWorkDetails() {
    const detailsRef = database.ref('details');
    
    detailsRef.once('value', function(snapshot) {
        const workDetails = snapshot.val();
        if (workDetails) {
            const containerC22 = document.querySelector('.c22');
            containerC22.innerHTML = '';
    
            let index = 1; // Index counter
            for (const key in workDetails) {
                if (workDetails.hasOwnProperty(key)) {
                    const workItem = document.createElement('div');
                    workItem.classList.add('work-item');
                    workItem.innerHTML = `
                        <p>Work ${index}: ${workDetails[key].description}</p>
                        <div class="radio-buttons">
                            <label><input type="radio" name="status${index}" value="completed" ${workDetails[key].status === 'completed' ? 'checked' : ''}> Completed</label>
                            <label><input type="radio" name="status${index}" value="working" ${workDetails[key].status === 'working' ? 'checked' : ''}> Working</label>
                            <label><input type="radio" name="status${index}" value="not-started" ${workDetails[key].status === 'not-started' ? 'checked' : ''}> Not Started</label>
                        </div>
                        <textarea name="description" placeholder="Enter work Updates" id="description${index}" cols="30">${localStorage.getItem(`update${index}`) || ''}</textarea>
                        <button class="submit-button" data-work-index="${index}">Submit</button>
                    `;
                    containerC22.appendChild(workItem);
                    index++; // Increment index counter
                }
            }
    
            // Add event listener to submit buttons
            document.querySelectorAll('.submit-button').forEach(button => {
                button.addEventListener('click', () => {
                    const workIndex = button.getAttribute('data-work-index');
                    const status = document.querySelector(`input[name="status${workIndex}"]:checked`).value;
                    const update = document.getElementById(`description${workIndex}`).value.trim();
                    submitWorkUpdate(workIndex, status, update);
                });
            });
        } else {
            console.log("No work details found.");
            const containerC22 = document.querySelector('.c22');
            containerC22.innerHTML = '<p>No work details found.</p>';
        }
    }, function(error) {
        console.error("Error fetching work details: ", error);
        const containerC22 = document.querySelector('.c22');
        containerC22.innerHTML = '<p>Error fetching work details. Please try again later.</p>';
    });
}

// Function to submit work update
function submitWorkUpdate(workIndex, description, status, update) {
    localStorage.setItem(`update${workIndex}`, update); // Save update text locally
    const updatesRef = database.ref('updates');
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
        updatesRef.child(uid).child(`work${workIndex}`).set({
            description: description,
            status: status,
            update: update
        }, function(error) {
            if (error) {
                alert("Error submitting work update: " + error); // Concatenate error with the string
            } else {
                alert("Work update submitted successfully!");
            }
        });
    } else {
        console.error('No user signed in.');
    }
}



// Call the function to submit the work update when the page loads
window.addEventListener('load', () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            displayWorkDetails();
        } else {
            console.error('No user signed in.');
        }
    });
});















































































// Function to get staff details after login
function getStaffDetails() {
    // Check if a user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            // Retrieve staff details from the database
            database.ref('staff').orderByChild('email').equalTo(user.email).once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var staffDetails = childSnapshot.val();
                    // Display staff details
                    displayStaffDetails(staffDetails);
                });
            });
        } else {
            // No user is signed in
            console.log('No user is signed in.');
        }
    });
}

// Call getStaffDetails function
getStaffDetails();




const fileInput = document.getElementById('profilePictureInput');
const profilePicture = document.getElementById('profile-picture');

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

  // Store the image in a different directory named 'staffImages'
  const storageRef = firebase.storage().ref('staffImages');
  const uploadTask = storageRef.child(fileName).put(file);

  uploadTask.on('state_changed',
      (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          alert('Upload is ' + progress + '% done' + "reload for confirmation");
      },
      (error) => {
          console.error('Error uploading image:', error);
      },
      () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              const uid = user.uid;
              firebase.database().ref('staff/' + uid + '/profilePicture').set(downloadURL);
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
  const profilePictureRef = firebase.database().ref('staff/' + uid + '/profilePicture');

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
