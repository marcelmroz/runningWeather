$(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      document.getElementById('latitudeInput').value = position.coords.latitude;
      document.getElementById('longitudeInput').value = position.coords.longitude;
      // console.log(position.coords.latitude + " " + position.coords.longitude);
    }, function(error) {
      console.log('Geolocation error:', error.message);
    });
  } else {
    console.log('Geolocation is not supported by this browser.');
  }
});
