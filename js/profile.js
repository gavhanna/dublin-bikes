const usernameTitle = document.getElementById("username");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    usernameTitle.innerText = user.displayName;
  } else {
    console.log('No user logged in.');
  }
  removeLoadingScreen();
});