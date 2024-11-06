import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyCBuo7O1EkK64-g6kyRDObL107TOI5CrTI",
            authDomain: "sia101-activity2-yadao-3e355.firebaseapp.com",
            projectId: "sia101-activity2-yadao-3e355",
            storageBucket: "sia101-activity2-yadao-3e355.appspot.com",
            messagingSenderId: "272365254099",
            appId: "1:272365254099:web:4f068fb5a657048a26eb26"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const formTitle = document.getElementById("formTitle");
        const switchFormLink = document.getElementById("switchFormLink");
        const loginForm = document.getElementById("loginForm");
        const signupForm = document.getElementById("signupForm");


        // Notification button functionality
const notificationButton = document.getElementById("notificationButton");
const notificationsContainer = document.getElementById("notifications");

// Array to hold notification messages
const notifications = [];

// Function to update the notifications display

// Event listener for the notification button
notificationButton.addEventListener("click", () => {
    notificationsContainer.style.display = notificationsContainer.style.display === 'none' || notificationsContainer.style.display === '' ? 'block' : 'none';
    if (notificationsContainer.style.display === 'block') {
        fetchLogs();
         // Update notifications when shown
        
    }
});

//Fetch Data from Webhook
const fetchLogs = async () => {
    try {
        // Send request to the server to retrieve logs
        const response = await fetch('https://yadao-web-system-server.onrender.com/logs');
        if (!response.ok) throw new Error('Failed to fetch logs'); // Error handling if response fails
        const logs = await response.json(); // Parse logs from JSON format
        const logEntries = logs.data || logs; // Access log entries directly or from the data field

        // Sort logs by timestamp in descending order (latest first)
        logEntries.sort((a, b) => new Date(b.content.timestamp) - new Date(a.content.timestamp));

        // Clear any existing notifications
        notificationList.innerHTML = '';

        if (logEntries.length === 0) {
            notificationList.innerHTML = '<li>No logs available.</li>';
            return;
        }

        // Loop through each log and display it in the notification list
        logEntries.forEach(log => {
            try {
                const content = JSON.parse(log.content || '{}'); // Parse log content as JSON
                const email = content.email || 'Unknown User'; // Extract the email from the content, with a fallback
                const timestamp = new Date(content.timestamp).toLocaleString('en-US', {
                    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
                });
                const listItem = document.createElement('li'); // Create list item for each log entry

                // Determine log text based on content type
                let logText;
                if (content.locationQuery) {
                    logText = `SEARCHED LOCATION: ${content.locationQuery}, ${timestamp}`;
                } else {
                    logText = `USER: ${email} LOGGED IN: ${timestamp}`;
                }
                
                listItem.textContent = logText; // Set the list item text content
                notificationList.prepend(listItem); // Prepend to place the latest notification at the top
            } catch (error) {
                console.error('Error parsing log content:', error);
            }
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        notificationList.innerHTML = '<li>Error fetching logs. Please try again later.</li>';
    }
};



    //Send notification to webhook
    function sendWebhookNotification(email) {
        const serverURL = 'https://yadao-web-system-server.onrender.com/login'; 
        const payload = { email: email, timestamp: new Date().toISOString(),message:"User Successfully Login!"};

    fetch(serverURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        console.log("Notification sent successfully", response);
        // Store a notification message based on the action
        //notifications.push(`Notification: ${action} at ${new Date().toLocaleTimeString()}`);
    })
    .catch(error => console.error("Error sending notification:", error));
}


        // Function to switch forms
        function switchForms() {
            const isLoginFormVisible = loginForm.style.display !== 'none';

            loginForm.style.display = isLoginFormVisible ? 'none' : 'block';
            signupForm.style.display = isLoginFormVisible ? 'block' : 'none';
            formTitle.innerText = isLoginFormVisible ? "Sign Up" : "Log In";
            document.getElementById("switchMessage").innerHTML = isLoginFormVisible 
                ? "Already have an account? <a href='#' id='switchFormLink'>Log in</a>" 
                : "Don't have an account? <a href='#' id='switchFormLink'>Sign up</a>";

            // Update the switchFormLink event listener after switching
            document.getElementById("switchFormLink").addEventListener("click", (event) => {
                event.preventDefault();
                switchForms();
            });
        }

        // Initial event listener for form switching
        switchFormLink.addEventListener("click", (event) => {
            event.preventDefault();
            switchForms();
        });

        // Login Handling
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert("Logged in successfully!");
                    sendWebhookNotification(email);
                    document.getElementById("searchContainer").style.display = "block";
                    loginForm.style.display = "none";
                    signupForm.style.display = "none";
                    switchMessageContainer.style.display = "none";
                    loginForm.reset();
                })
                .catch((error) => {
                    document.getElementById("message").innerText = error.message;
                });
        });

        // Sign-Up Handling
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert("Sign-up successful!");
                    sendWebhookNotification('User Signed Up');
                    document.getElementById("searchContainer").style.display = "block";
                    loginForm.style.display = "none";
                    signupForm.style.display = "none";
                    switchMessageContainer.style.display = "none";
                    signupForm.reset();
                })
                .catch((error) => {
                    document.getElementById("signupMessage").innerText = error.message;
                });
        });

        function handleAuthSuccess() {
            alert("Authentication successful!");
            searchContainer.style.display = "block";
            loginForm.style.display = "none";
            signupForm.style.display = "none";
            notificationButton.style.display = "inline";  // Show the notification bell
        }

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => handleAuthSuccess())
                .catch((error) => alert("Error: " + error.message));
        });

            signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;

            createUserWithEmailAndPassword(auth, email, password)
                .then(() => handleAuthSuccess(true)) // Pass true to show notification for sign-up
                .catch((error) => alert("Error: " + error.message));
        });

        // Search and Map Handling
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        const marker = L.marker([51.5, -0.09]).addTo(map);

        document.getElementById("searchLocationBtn").addEventListener("click", () => {
            const location = document.getElementById("location").value;
            if (!location) return alert("Please enter a location to search.");
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const { lat, lon } = data[0];
                        map.setView([lat, lon], 13);
                        L.marker([lat, lon]).addTo(map).bindPopup(`<b>${location}</b>`).openPopup();
                    } else alert("Location not found. Please try another search.");
                })
                .catch(error => console.error("Error with geocoding request:", error));
        });         