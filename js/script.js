const map = L.map("map").setView([35.70015230480259, 51.33811941768732], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

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