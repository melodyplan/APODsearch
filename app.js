const API_KEY = 'GHtmvSXNIA94h6fHzpAR8qxHQsNYydkHDcXluDQr'
const ROOT_URL = 'https://api.nasa.gov/planetary/apod'


function main() {

}

function fetchMainImage() {
  axios.get(ROOT_URL, { params: { api_key: API_KEY } })
    .then(function(response) {
      console.log(response.data);
      $('.main-image').attr('style', `background-image: url(${response.data.url}`);
    })
}

function eventHandlers() {
  $('.open-btn').on('click', function() {
    $('aside').addClass('open');
  })

  $('.close-btn').on('click', function() {
    $('aside').removeClass('open');
  })
}

$(document).ready(function() {
  eventHandlers();
  fetchMainImage();
  main();
})
