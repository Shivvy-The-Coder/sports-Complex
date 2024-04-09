// Initialize Firebase
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

// Function to fetch staff data based on EID
function fetchStaffData() {
    const eid = document.getElementById('eidInput').value;

    // Display "Searching" alert
    alert("Searching...");

    // Reference to the Firebase database
    const dbRef = firebase.database().ref('staff').orderByChild('eid').equalTo(eid);

    dbRef.once('value', (snapshot) => {
        const staffData = snapshot.val();
        if (staffData) {
            document.getElementById('staffDataSection').innerHTML = ""; // Clear previous data
            // Since there might be multiple staff members with the same EID, 
            // we'll iterate through each result and display them.
            for (const key in staffData) {
                if (staffData.hasOwnProperty(key)) {
                    displayStaffData(staffData[key]);
                }
            }
            // Show container3 when data is found
            document.querySelector('.container3').style.display = 'flex'; // Or 'block' depending on your layout
        } else {
            document.getElementById('staffDataSection').innerHTML = "<p>Staff not found.</p>";
        }
    });
}


// Function to display staff data
function displayStaffData(staffData) {
    const staffDataSection = document.getElementById('staffDataSection');

    const staffInfo = document.createElement('div');
    staffInfo.innerHTML = `
        <h2>Staff Details</h2>
        <div class="staff-info-box">
            <p>EID: ${staffData.eid}</p>
        </div>
        <div class="staff-info-box">
            <p>Email: ${staffData.email}</p>
        </div>
        <div class="staff-info-box">
            <p>First Name: ${staffData.firstname}</p>
        </div>
        <div class="staff-info-box">
            <p>Last Name: ${staffData.lastname}</p>
        </div>
        <div class="staff-info-box">
            <p>Join Date: ${staffData.joindate}</p>
        </div>
        <div class="staff-info-box">
            <p>Last Login: ${staffData.last_login}</p>
        </div>
        <!-- Add other details here -->
    `;

    const staffInfoBoxes = staffInfo.querySelectorAll('.staff-info-box');
    staffInfoBoxes.forEach(box => {
        box.style.border = '2px solid black'; // Increased border width and changed color
        box.style.borderRadius = '5px';
        box.style.padding = '10px';
        box.style.marginBottom = '10px';
        box.style.color = 'black'; // Set font color to white
        box.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)'; // Added shadow effect
        box.style.textShadow = '1px 1px 1px grey';

    });

    staffDataSection.appendChild(staffInfo);
}

