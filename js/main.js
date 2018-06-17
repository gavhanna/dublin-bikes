const apiKey = "ef653629fed566ec812f1444f8bb2b3ddc6e1bbf";
const apiURL =
  "https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=";
const contentDiv = document.getElementById("content");
let locations;
let marker;
const defaultLocation = 77;

document.addEventListener("DOMContentLoaded", function () {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener("click", function () {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
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
      console.log(data);
      locations = data;
      // Go to default location
      const defaultLoc = data.filter(el => {
        return el.number === defaultLocation;
      })
      createInfoHTML(defaultLoc[0]);

      data.forEach(location => {
        let marker = new google.maps.Marker({
          position: location.position,
          map: self.map,
          label: String(location.available_bikes) +
            "/" +
            String(location.available_bike_stands),
          location: location
        });
        marker.addListener("click", function () {
          map.panTo(marker.getPosition());
          createInfoHTML(this.location);
        });
      });
    });
  });
}

function createInfoHTML(data) {
  console.log(data);

  const title = document.getElementById("info-title");
  const address = document.getElementById("info-address");
  const bikes = document.getElementById("info-bikes");
  const spaces = document.getElementById("info-spaces");
  const status = document.getElementById("info-status");

  title.innerText = data.address;
  address.innerText = data.number;
  bikes.innerText = String(data.available_bikes);
  spaces.innerText = String(data.available_bike_stands);
  status.innerText = data.status;

  // Add style dynamically
  if (spaces.innerText < 3) {
    spaces.style.color = "red"
  } else {
    spaces.style.color = "green"
  }
  if (bikes.innerText < 3) {
    bikes.style.color = "red"
  } else {
    bikes.style.color = "green"
  }

  if (status.innerText === "OPEN") {
    status.style.color = "green";
  } else {
    status.style.color = "red";
  }
  console.log(status.innerText);

  initializeStreetView(data.position);
}

window.initMap = () => {
  let loc = {
    lat: 53.350929,
    lng: -6.265125
  };
  self.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: loc
  });
  getData();
};


function initializeStreetView(location) {
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetViewMap'), {
      position: location,
      pov: {
        heading: 34,
        pitch: 0
      }
    });
  map.setStreetView(panorama);
}