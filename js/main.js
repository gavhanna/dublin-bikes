const apiKey = "ef653629fed566ec812f1444f8bb2b3ddc6e1bbf";
const apiURL =
  "https://api.jcdecaux.com/vls/v1/stations?contract=Dublin&apiKey=";
const contentDiv = document.getElementById("content");
const faveBtn = document.getElementById("addToFave");
let locations;
let userFaves = [];
let userFavesByNum = [];
let marker;
const defaultLocation = 77;
let currentUser;
const db = firebase.database();



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
  getUserFavourites().then(() => {
    getData();
  });;
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
      // Go to default location
      const defaultLoc = data.filter(el => {
        return el.number === defaultLocation;
      })
      createInfoHTML(defaultLoc[0]);

      data.forEach(location => {
        let marker = new google.maps.Marker({
          position: location.position,
          map: self.map,
          icon: "custom-marker.png",
          label: String(location.available_bikes) +
            "/" +
            String(location.available_bike_stands),
          location: location
        });
        marker.addListener("click", function () {
          map.panTo(marker.getPosition());
          createInfoHTML(this.location);
          document.getElementById('content').scrollIntoView();
        });
      });
      removeLoadingScreen();
    });
  });
}

function createInfoHTML(data) {
  const okColor = "lime";
  const warningColor = "red";

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
    spaces.style.color = warningColor
  } else {
    spaces.style.color = okColor;
  }
  if (bikes.innerText < 3) {
    bikes.style.color = warningColor
  } else {
    bikes.style.color = okColor;
  }

  if (status.innerText === "OPEN") {
    status.style.color = okColor;
  } else {
    status.style.color = warningColor;
  }

  initializeStreetView(data.position);

  faveBtn.setAttribute("data-number", data.number);
  faveBtn.removeEventListener("click", removeFave);
  faveBtn.removeEventListener("click", submitFave);
  if (userFavesByNum.includes(data.number)) {
    const obj = userFaves.filter(e => {
      return e.val === data.number;
    });
    faveBtn.setAttribute("data-dbKey", obj[0].key);
    applyRemoveListenerToBtn();
  } else {
    applyListenerToAddBtn();
  }
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

function removeLoadingScreen() {
  document.getElementById("loading").remove();
}


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    currentUser = user;
    createNavLink(currentUser.displayName, "user-navlink", "profile.html");
    createNavLink("Sign Out", "signout-btn");
    document.getElementById("signout-btn")
      .addEventListener("click", () => {
        signOut();
      })
    //applyListenerToAddBtn();
    getUserFavourites().then(() => {
      getData();
    });
  } else {
    createNavLink("Sign In", "signin-btn", "login.html");
    window.location = "https://gavhanna.github.io/dublin-bikes/login.html";
  }
  //getData();
});

function createNavLink(text, id, href) {
  const link = document.createElement("a");
  const navbar = document.querySelector(".navbar-start");

  link.href = href;
  link.className = "navbar-link";
  link.id = id;
  link.innerText = text;
  navbar.appendChild(link);
}

function signOut() {
  firebase.auth().signOut().then(function () {
    console.log('Logged out.');
    window.location.pathname = "/dublin-bikes/";
  }).catch(function (error) {
    console.log('Error logging out:', error);
  });
}

function applyListenerToAddBtn() {
  faveBtn.style.background = "#65bf68";
  faveBtn.style.display = "block";
  faveBtn.addEventListener("click",
    submitFave);
}

function submitFave() {
  const number = faveBtn.dataset.number;
  db.ref(currentUser.uid).push(number)
    .then(r => {
      userFaves.push({
        key: r.key,
        val: parseInt(number)
      });
      userFavesByNum.push(parseInt(number));
      faveBtn.setAttribute("data-dbKey", r.key);
      faveBtn.removeEventListener("click", submitFave);
      applyRemoveListenerToBtn();
    })
}

function applyRemoveListenerToBtn() {
  faveBtn.style.background = "red"
  faveBtn.style.display = "block";
  faveBtn.addEventListener("click",
    removeFave);
}

function removeFave() {
  db.ref(currentUser.uid + "/" + faveBtn.dataset.dbkey).remove()
    .then(() => {
      faveBtn.removeEventListener("click", removeFave);
      applyListenerToAddBtn();
      getUserFavourites();
    })
};

function getUserFavourites() {
  return db.ref(currentUser.uid).once('value')
    .then(function (snapshot) {
      userFaves = [];
      userFavesByNum = [];
      snapshot.forEach(el => {
        const key = el.key;
        const val = el.val();
        const keyVal = {
          key: key,
          val: parseInt(val)
        };
        userFavesByNum.push(parseInt(val));
        userFaves.push(keyVal);
      });
    })

}