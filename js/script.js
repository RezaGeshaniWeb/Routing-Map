const map = L.map("map").setView([35.70015230480259, 51.33811941768732], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

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

// routing machine
let control, startMarker, endMarker, markers = []

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

  // add two markers with SVG icon
  const iconColor = markers.length === 0 ? '#28a745' : '#dc3545'
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="${iconColor}" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
    </svg>
  `

  const markerIcon = L.divIcon({
    html: svgIcon,
    className: 'custom-svg-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
  const marker = L.marker(e.latlng, { icon: markerIcon }).addTo(map)
  markers.push(marker)

  // set popup
  const lable = markers.length === 1 
    ? 'Origin<br><span class="persian-text">مبدا</span>' 
    : 'Destination<br><span class="persian-text">مقصد</span>'
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
      let distanceText = distance > 1000 ? Math.round(distance / 1000) + ' km' : Math.round(distance) + ' m'
      let distanceTextPersian = distance > 1000 ? Math.round(distance / 1000) + ' کیلومتر' : Math.round(distance) + ' متر'

      let time = Math.round(summary.totalTime / 60)

      const perMeter = 50
      const totalMoney = Math.round(Math.round(distance) * perMeter)

      L.popup().setLatLng(markers[1].getLatLng()).setContent(`
        <div>
          <h5>Route Information<br><span class="persian-text">اطلاعات مسیر</span></h5>
          <p>Distance: ${distanceText}<br><span class="persian-text">فاصله: ${distanceTextPersian}</span></p>
          <p>Estimated Time: ${time} minutes<br><span class="persian-text">زمان تقریبی: ${time} دقیقه</span></p>
          <p>Fare: ${totalMoney}<br><span class="persian-text">کرایه: ${totalMoney}</span></p>
        </div>  
      `).openOn(map)
    })
  }
})