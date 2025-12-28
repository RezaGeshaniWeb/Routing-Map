const map = L.map("map").setView([35.704065544779105, 51.10967164109585], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

// project-osrm.org

const point1 = [35.704065544779105, 51.10967164109585];
const point2 = [35.707550374942485, 51.22794632644294];

const marker1 = L.marker(point1).addTo(map);
const marker2 = L.marker(point2).addTo(map);

const url = `http://router.project-osrm.org/route/v1/driving/${point1[1]},${point1[0]};${point2[1]},${point2[0]}?overview=full&geometries=geojson`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
    const coordinates = data.routes[0].geometry.coordinates
    const latLng = coordinates.map(coor => [coor[1], coor[0]])
    L.polyline(latLng, {
      color: 'blue',
      weight: 4,
      opacity: 0.7,
    }).addTo(map)
  });
