const apiKey = "ef653629fed566ec812f1444f8bb2b3ddc6e1bbf";
const apiURL =
  "https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=";
const contentDiv = document.getElementById("content");
let locations;
let marker;

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
      data.forEach(location => {
        let marker = new google.maps.Marker({
          position: location.position,
          map: self.map,
          label: String(location.available_bikes) +
            "/" +
            String(location.available_bike_stands),
          location: location
          // address: location.address,
          // bike_stands: location.bike_stands,
          // available_bikes: location.available_bikes,
          // available_bike_stands: location.available_bike_stands,
          // number: location.number,
          // banking: location.banking,
          // status: location.status
        });
        marker.addListener("click", function () {
          console.log(this);
          map.panTo(marker.getPosition());
          createInfoHTML(this.location);
        });
      });
    });
  });
}

function createInfoHTML(data) {
  console.log(data);
  contentDiv.innerHTML = "";
  const containerDiv = document.createElement("div");
  const title = document.createElement("h2");
  const address = document.createElement("p");
  const bikes = document.createElement("p");
  const spaces = document.createElement("p");
  const status = document.createElement("p");
  const streetViewContainer = document.createElement("div");
  const streetViewMap = document.createElement("div");
  const figure = document.createElement("figure");
  // const img = document.createElement("img");

  contentDiv.className = "card";
  containerDiv.className = "card-content";
  title.className = "info-title";
  address.className = "info-address";
  bikes.className = "info-bikes";
  spaces.className = "info-spaces";
  status.className = "info-status";
  streetViewMap.id = "streetViewMap";
  streetViewContainer.className = "card-image"
  figure.className = "image is-4by3"


  // img.className = "location-img";
  // img.src = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${data.position.lat},${data.position.lng}&fov=90&pitch=10&key=AIzaSyAB0nn90gUb-ulFr7Og9BuUjiQEZdAyryc`;

  title.innerText = data.address;
  address.innerText = "Location: " + data.number;
  bikes.innerText = "Bikes: " + String(data.available_bikes);
  spaces.innerText = "Empty spaces: " + String(data.available_bike_stands);
  status.innerText = "Status: " + data.status;

  containerDiv.appendChild(title);
  containerDiv.appendChild(address);
  containerDiv.appendChild(bikes);
  containerDiv.appendChild(spaces);
  containerDiv.appendChild(status);
  contentDiv.appendChild(streetViewMap);
  contentDiv.appendChild(containerDiv);
  // contentDiv.appendChild(img);

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
  // var map = new google.maps.Map(document.getElementById('map'), {
  //   center: location,
  //   zoom: 14
  // });
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('streetViewMap'), {
      position: location,
      pov: {
        heading: 34,
        pitch: 10
      }
    });
  map.setStreetView(panorama);
}

// var panorama;

// function initializeStreetView() {
//   panorama = new google.maps.StreetViewPanorama(
//     document.getElementById('streetViewMap'), {
//       position: {
//         lat: 37.869260,
//         lng: -122.254811
//       },
//       pov: {
//         heading: 165,
//         pitch: 0
//       },
//       zoom: 1
//     });
// }