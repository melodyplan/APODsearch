const API_KEY = 'GHtmvSXNIA94h6fHzpAR8qxHQsNYydkHDcXluDQr'
const ROOT_URL = 'https://api.nasa.gov/planetary/apod'


function main() {
  //extend the fetchMainImage function to be able to take a date as one of its arguments and fetch the correct date image
}

function fetchMainImage(date) {
  axios.get(ROOT_URL, {
      params: {
        api_key: API_KEY,
        date: date //as long as you change the paramater by yyyy-mm-dd and pass it through fetchMainImage as a parameter it should be good to go
      }
    })
    .then(function(response) {
      if (response.data.media_type === 'image') {
        $('.main-image').attr('style', `background-image: url(${response.data.url}`);
        $('.main-image iframe').addClass('hidden');
      } else if (response.data.media_type === 'video') {
        $('.main-image iframe').attr('src', response.data.url);
        $('.main-image iframe').removeClass('hidden');
      }
    })
}

function updateMonth() {
  $('.current-month').text(moment().format('MMM'))
}

function buildCalendar() {
  const range = moment.range('2017-05-01', '2017-05-31');

  for (let month of range.by('days')) {
    console.log(month.format('dd'));
  }
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
  updateMonth();
  buildCalendar();
  main();
})
