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
let markerTaxi = null;

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
    if (markerTaxi) {
      map.removeLayer(markerTaxi);
      markerTaxi = null; 
    }
  }

  // add two markers with SVG icon
  const iconColor = markers.length === 0 ? '#28a745' : '#dc3545'
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="${iconColor}" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
    </svg>
  `
  const svgTaxiIcon = `icon/car.png`
  const imgTaxiIcon = document.createElement('img')
  imgTaxiIcon.setAttribute('src', svgTaxiIcon)

  const markerIcon = L.divIcon({
    html: svgIcon,
    className: 'custom-svg-icon',
    iconSize: [10, 10],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
  const taxiIcon = L.divIcon({
    html: imgTaxiIcon,
    className: 'custom-svg-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    rotationOrigin: 'center center',
    rotationAngle: 90
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

    control.on('routesfound', e => {
      let routes = e.routes
      if (routes.length > 0) {
        const coordinates = routes[0].coordinates;

        function animateTaxi(coord) {
          if (markerTaxi) {
            map.removeLayer(markerTaxi);
          }

          let i = 0
          let speed = 200
          const initialBearing = calculate(coord[0].lat, coord[0].lng, coord[1].lat, coord[1].lng)

          markerTaxi = L.marker(markers[0].getLatLng(), { icon: taxiIcon, rotationAngle: initialBearing }).addTo(map)

          function animate() {
            if (i < coord.length - 1) {
              let current = coord[i]
              let next = coord[i + 1]

              const { lat: lat1, lng: lng1 } = current
              const { lat: lat2, lng: lng2 } = next

              let bearing = calculate(lat1, lng1, lat2, lng2)

              let angleDiff = bearing - markerTaxi.options.rotationAngle
              if (angleDiff > 180) angleDiff -= 360
              if (angleDiff < -180) angleDiff += 360

              const newAngle = markerTaxi.options.rotationAngle + angleDiff

              markerTaxi.setLatLng([lat1, lng1])
              markerTaxi.setRotationAngle(newAngle)

              i++
              setTimeout(animate, speed)
            } else {
              markerTaxi.setLatLng(coord[coord.length - 1]);
            }
          }
          animate()
        }
        animateTaxi(coordinates)
      }

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

function calculate(lat1, lng1, lat2, lng2) {
  lat1 = lat1 * Math.PI / 180
  lng1 = lng1 * Math.PI / 180
  lat2 = lat2 * Math.PI / 180
  lng2 = lng2 * Math.PI / 180

  const y = Math.sin(lng2 - lng1) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)

  let bearing = ((Math.atan2(y, x) * 180) / Math.PI)
  bearing = (bearing + 360) % 360

  return bearing
}