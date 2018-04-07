import locService from './services/loc.service.js';
import mapService from './services/map.service.js';
import weatherService from './services/weather.service.js';

let gLat;
let gLng;
let isSentLoc;

window.onload = () => {
  let givenLat = getParameterByName('lat');
  let givenLng = getParameterByName('lng');
  if (givenLat !== null && givenLng !== null) {
    gLat = parseFloat(givenLat);
    gLng = parseFloat(givenLng);
    isSentLoc = true;
    init(gLat, gLng);
  } else {
    locService
      .getPosition()
      .then(pos => {
        gLat = pos.coords.latitude;
        gLng = pos.coords.longitude;
        console.log('User position is:', pos.coords);
        init(gLat, gLng);
      })
      .catch(mapErr => {
        console.log('Map error:', mapErr);
      });
  }
};

document.querySelector('.btn-my-location').addEventListener('click', () => {
  init(gLat, gLng)
});

document.querySelector('.btn-copy-location').addEventListener('click', () => {
  var textArea = document.createElement("textarea");
  var url = window.location.href;
  if (!isSentLoc) {
    var urlWithMyLoc = `${url}?lat=${gLat}&lng=${gLng}`;
    textArea.value = urlWithMyLoc;
  } else {
    textArea.value = url;
  }
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  swal('Copied to the clipboard!');
});

document.querySelector('button[type="submit"]').addEventListener('click', () => {
    var elAddress = document.querySelector('input[name="search"]').value;
    locService
      .getCoordsByAddress(elAddress)
      .then(res => {
        document.querySelector('input[name="search"]').value = '';
        var resLat = res.data.results[0].geometry.location.lat;
        var resLng = res.data.results[0].geometry.location.lng;
        init(resLat, resLng);
      })
      .catch(searchErr => {
        console.log('Search error:', searchErr);
    });
});

function init(lat, lng) {
  mapService.initMap(lat, lng).then(() => {
    mapService.addMarker({
      lat: lat,
      lng: lng
    });
    locService
      .getAddressByCoords(lat, lng)
      .then(res => {
        weatherService
          .getWeather(lat, lng)
          .then(res => {
            const CELVIN = 273.15;
            const minTemp = parseInt(res.data.main.temp_min - CELVIN);
            const maxTemp = parseInt(res.data.main.temp_max - CELVIN);
            const weatherDesc = res.data.weather[0].description;
            const weatherIcon = res.data.weather[0].icon;
            renderWeather(minTemp, maxTemp, weatherDesc, weatherIcon);
          })
          .catch(weatherErr => {
            console.log('Weather error:', weatherErr);
          });
        var currLocation = res.data.results[1].formatted_address;
        document.querySelector('.location span').innerHTML = currLocation;

        var elHiddens = document.querySelectorAll('.hidden');
        for (var i = 0; i < elHiddens.length; i++) {
          elHiddens[i].hidden = false;
        }
      })
      .catch(locationErr => {
        console.log('Location error:', locationErr);
      });
  });
}

function renderWeather(minTemp, maxTemp, desc, icon) {
  document.querySelector('.temp').innerHTML = (minTemp === maxTemp)?
  `${minTemp}&#8451`:`${minTemp}&#8451 - ${maxTemp}&#8451`;
  document.querySelector('.weather-desc').innerHTML = desc;
  document.querySelector(
    '.weather-icon'
  ).src = `http://openweathermap.org/img/w/${icon}.png`;
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}