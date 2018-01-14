var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
output.innerHTML = slider.value;
}


function initMap() {
  var uluru = {lat: -25.363, lng: 131.044};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTKbfQnZkRGotGraaBjvoAnr0DCA9kNx0&callback=initMap"
