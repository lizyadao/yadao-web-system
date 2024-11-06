// Firebase configuration (replace with your own
const firebaseConfig = {
        apiKey: "AIzaSyCBuo7O1EkK64-g6kyRDObL107TOI5CrTI",
        authDomain: "sia101-activity2-yadao-3e355.firebaseapp.com",
        projectId: "sia101-activity2-yadao-3e355",
        storageBucket: "sia101-activity2-yadao-3e355.appspot.com",
        messagingSenderId: "272365254099",
        appId: "1:272365254099:web:02d809348847860a26eb26"
    };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Switching between login and sign-up forms
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const formTitle = document.getElementById('form-title');

switchToSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    formTitle.innerText = 'Sign Up';
});

switchToLogin.addEventListener('click', () => {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    formTitle.innerText = 'Log In';
});

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Logged in successfully");
            // Redirect to dashboard or perform further actions
        })
        .catch(error => {
            alert("Login failed: " + error.message);
        });
});

// Handle sign-up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            alert("Signed up successfully");
            // Redirect to dashboard or perform further actions
        })
        .catch(error => {
            alert("Sign-up failed: " + error.message);
        });
});
