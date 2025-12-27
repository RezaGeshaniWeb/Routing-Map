const map = L.map("map").setView([35.70015230480259, 51.33811941768732], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.on("click", (e) => {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  console.log(`latlng: ${lat} , ${lng}`);

  const marker1 = L.marker(e.latlng, { draggable: true })
    .bindPopup(`latlng: ${lat} , ${lng}`)
    .addTo(map);

  marker1.on("dragstart", (e) => {
    console.log("start");
  });

  marker1.on("dragend", (e) => {
    console.log("end");
  });
});

map.on("zoomend", (e) => {
  console.log("zoom : ", map.getZoom());
});

map.on("moveend", (e) => {
  console.log("move : ", map.getCenter());
});

map.panTo([35.744122865962225, 51.14135870933576]);