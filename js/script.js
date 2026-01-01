const map = L.map("map").setView([35.70015230480259, 51.33811941768732], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


// routing machine
let control, startMarker, endMarker
let markers = []

map.on('click', e => {
  if (markers.length >= 2) {
    // remove markers icon
    markers.forEach(marker => map.removeLayer(marker))
    // remove all markers
    markers = []
    // remove line control
    if (control) {
      map.removeControl(control)
    }
  }

  // add two markers
  const markerIcon = L.icon({
    iconUrl: markers.length === 0 ? 'img/shop-icon1.png' : 'img/shop-icon2.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
  const marker = L.marker(e.latlng, { icon: markerIcon }).addTo(map)
  markers.push(marker)

  // set popup
  const lable = markers.length === 1 ? 'مبدا' : 'مقصد'
  marker.bindPopup(lable).openPopup()

  // set routing machine
  if (markers.length === 2) {
    control = L.Routing.control({
      waypoints: [
        L.latLng(markers[0].getLatLng()),
        L.latLng(markers[1].getLatLng())
      ],
      createMarker: () => null,
      show: false,
      lineOptions: {
        styles: [{
          color: 'blue',
          weight: 6,
        }]
      }
    }).addTo(map);

    // information about route
    control.on('routesfound', e => {
      let summary = e.routes[0].summary

      let distance = summary.totalDistance
      let distanceText = distance > 1000 ? Math.round(distance / 1000) + ' کیلومتر' : Math.round(distance) + ' متر'

      let time = Math.round(summary.totalTime / 60)

      const perMeter = 500
      const totalMoney = Math.round(Math.round(distance) * perMeter)

      L.popup().setLatLng(markers[1].getLatLng()).setContent(`
        <div>
          <h5>اطلاعات مسیر</h5>
          <p>فاصله: ${distanceText}</p>
          <p>زمان تقریبی: ${time} دقیقه</p>
          <p>کرایه: ${totalMoney}</p>
        </div>  
      `).openOn(map)
    })
  }
})



// search box
const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
}).on('markgeocode', e => {
  console.log(e);
  let bbox = e.geocode.bbox
  let poly = L.polygon([
    bbox.getSouthEast(),
    bbox.getNorthEast(),
    bbox.getNorthWest(),
    bbox.getSouthWest(),
  ]).addTo(map)
  map.fitBounds(poly.getBounds())
  L.marker(e.geocode.center).addTo(map).bindPopup(e.geocode.name).openPopup()
})
  .addTo(map)