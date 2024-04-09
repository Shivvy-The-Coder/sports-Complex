window.addEventListener('load', () => {
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

    const database = firebase.database();

    function addTask(index, description) {
        const detailsRef = database.ref('details');
        detailsRef.push({
            index: index,
            description: description
        });
    }

    const addTaskBtn = document.getElementById('addTaskBtn');
    const submitTasksBtn = document.getElementById('submitTasksBtn');
    let taskCounter = 1;

    addTaskBtn.addEventListener('click', () => {
        const taskContainer = document.querySelector('.task');
        const taskDescription = document.createElement('div');
        taskDescription.classList.add('task-description');
        taskDescription.innerHTML = `
            <label for="description">Work ${taskCounter} Description:</label>
            <textarea id="description${taskCounter}" rows="4"></textarea>
        `;
        // Apply styles to the task description
        taskDescription.style.textAlign = 'center';
        taskDescription.style.color = 'white';
        taskDescription.style.textShadow = '5px 1px 5px rgb(12, 5, 5)';
        taskDescription.style.fontFamily = "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif";
        
        taskContainer.appendChild(taskDescription);
        taskCounter++;
    });

    submitTasksBtn.addEventListener('click', () => {
        const taskDescriptions = document.querySelectorAll('.task-description textarea');
        taskDescriptions.forEach((textarea, index) => {
            const description = textarea.value.trim();
            if (description !== '') {
                addTask(index + 1, description);
                alert(`Task ${index + 1} submitted successfully!`);
            } else {
                alert(`Please enter a description for Task ${index + 1}.`);
            }
        });
    });
});
