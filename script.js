// set tag id
// set Set the latitude and longitude of the location
// Setting the initial zoom level (1, 18)
const map = L.map("map").setView([35.70015230480259, 51.33811941768732], 15);


// get api & set map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


// set custom icon for pointer
const metroIcon = L.icon({
  iconUrl: "https://www.svgrepo.com/show/397501/metro.svg",
  iconSize: [30, 30],
});


// add pointer
let marker1 = L.marker([35.70008260317534, 51.33816233315887]).addTo(map);

let marker2 = L.marker([35.69969245203644, 51.32015210727593], {
  icon: metroIcon,
  title: "subway",
}).addTo(map);


// add popup
// marker1.bindPopup('azadi tower')

// marker1.bindPopup('azadi tower').openPopup()

// marker1.bindPopup(`
//     <h3>title</h3>
//     <p>description</p>
//     <button>click for more</button>
// `);

marker1.bindPopup("azadi tower", {
  minWidth: 200,
  maxWidth: 300,
  closeButton: true,
  closeOnClick: true,
});
