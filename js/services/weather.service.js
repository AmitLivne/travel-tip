
function getWeather(lat, lng) {
  console.log('Getting Weather');
    return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=5e547392a4decdc01b806a3c35f5746c`
    )
  }

export default {
    getWeather
}


