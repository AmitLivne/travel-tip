import { GoogleMapsApi } from './gmap.class.js';

let map;
let marker;

function initMap(lat, lng) {
  console.log('InitMap');
  let gmapApi = new GoogleMapsApi();
  return gmapApi.load().then(() => {
    map = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15
    });
    console.log('Map!', map);
  });
}
function addMarker(loc) {
  let icon = {
    url: 'http://icons.iconarchive.com/icons/sykonist/south-park/256/Cartman-normal-icon.png',
    scaledSize: new google.maps.Size(40, 40)
  };

  marker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    position: loc,
    map: map,
    icon: icon,
    title: 'Don\'t touch me!!!'
  });
  marker.addListener('click', applyBounce);
}

function applyBounce() {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => {
    marker.setAnimation(null);
  }, 2000);
}

export default {
  initMap,
  addMarker
};
