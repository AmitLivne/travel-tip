function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function getAddressByCoords(lat, lng) {
  console.log('Getting Address');
  return axios
  .get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCl0AvV29EUXrzmf-xK3YY-02IOeX9F8ZU`
  )
}

function getCoordsByAddress(address) {
  console.log('Getting Coords');
  return axios
  .get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCl0AvV29EUXrzmf-xK3YY-02IOeX9F8ZU`
  )
}

export default {
  getPosition,
  getAddressByCoords,
  getCoordsByAddress,
};
