// // Initialize Firebase
// const config = {
//   apiKey: "AIzaSyDGkME_v6Gk0u6wYky9OEDMoDJjI5vQvfg",
//   authDomain: "dbikes-3ddcd.firebaseapp.com",
//   databaseURL: "https://dbikes-3ddcd.firebaseio.com",
//   projectId: "dbikes-3ddcd",
//   storageBucket: "",
//   messagingSenderId: "813535336777"
// };
// firebase.initializeApp(config);

// const auth = firebase.auth();

// const txtEmail = document.getElementById("txtEmail");
// const txtPassword = document.getElementById("txtPassword");
// const btnLogin = document.getElementById("btnLogin");
// const btnSignUp = document.getElementById("btnSignUp");
// const btnLogout = document.getElementById("btnLogout");

// btnLogin.addEventListener("click", e => {
//   const email = txtEmail.value;
//   const pass = txtPassword.value;
//   const auth = firebase.auth();
//   const promise = auth.signInWithEmailAndPassword(email, pass);
//   promise.catch(e => console.log(e.message));
// });

// btnSignUp.addEventListener("click", e => {
//   // TODO: check for real email
//   const email = txtEmail.value;
//   const pass = txtPassword.value;
//   const auth = firebase.auth();
//   const promise = auth.createUserWithEmailAndPassword(email, pass);
//   promise.catch(e => console.log(e.message));
// });

// btnLogout.addEventListener("click", e => {
//   firebase.auth().signOut();
// });

// firebase.auth().onAuthStateChanged(firebaseUser => {
//   if (firebaseUser) {
//     console.log(firebaseUser);
//     btnLogout.classList.remove("is-hidden");
//   } else {
//     console.log("not logged in");
//     btnLogout.classList.add("is-hidden");
//   }
// });

// ui.start('#firebaseui-auth-container', {
//   signInOptions: [
//     firebase.auth.EmailAuthProvider.PROVIDER_ID
//   ],
//   // Other config options...
// });

// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: 'index.html',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);