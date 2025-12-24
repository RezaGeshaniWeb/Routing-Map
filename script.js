// set tag id
// set Set the latitude and longitude of the location
// Setting the initial zoom level (1, 18)
const map = L.map("map").setView([35.70015230480259, 51.33811941768732], 15);


// get api & set map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


// data
const shops = [
  {
    position: [35.69943334081197, 51.3335470542868],
    name: 'فروشگاه مرکزی',
    description: 'شعبه اصلی',
    img: 'img/shop-icon2.png',
  },
  {
    position: [35.70028773592904, 51.33222538864043],
    name: 'فروشگاه شمال',
    description: 'شعبه شمال',
    img: 'img/shop-icon3.png',
  },
]


// custom icon
const storeIcon = L.icon({
  iconUrl: 'img/shop-icon1.png',
  iconSize: [30, 30]
})


// add marker & popup
shops.forEach(shop => {
  L.marker(shop.position, {
    icon: storeIcon
  })
  .bindPopup(`
    <img src='${shop.img}' style='width: 100%;' />
    <h3>${shop.name}</h3>  
    <p>${shop.description}</p>  
  `)
  .addTo(map)
})