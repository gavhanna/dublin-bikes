const usernameTitle = document.getElementById("username");
const table = document.getElementById("table");


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    usernameTitle.innerText = user.displayName;

  } else {
    console.log('No user logged in.');
  }
});

function getData() {
  fetch(apiURL + apiKey).then(response => {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }
    response.json().then(data => {
      locations = data;
      getSavedLocations(locations, currentUser)
    });
    removeLoadingScreen();
  });
}

function getSavedLocations(locations) {
  let faveLocations = [];
  locations.forEach((loc, i) => {
    userFaves.forEach(fave => {
      if (fave.val == loc.number) {
        faveLocations.push(loc);
      }
    })
  })
  console.log(faveLocations);
  faveLocations.forEach(fave => {
    createTableRow(fave);
  })
}

function createTableRow(data) {
  const row = document.createElement("tr");
  const street = document.createElement("td");
  const num = document.createElement("td");
  const bikes = document.createElement("td");
  const spaces = document.createElement("td");
  const status = document.createElement("td");

  street.innerText = data.address
  num.innerText = data.number
  bikes.innerText = data.available_bikes
  spaces.innerText = data.available_bike_stands
  status.innerText = data.status

  row.appendChild(street);
  row.appendChild(num);
  row.appendChild(bikes);
  row.appendChild(spaces);
  row.appendChild(status);

  table.appendChild(row);
}