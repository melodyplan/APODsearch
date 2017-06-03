const API_KEY = 'GHtmvSXNIA94h6fHzpAR8qxHQsNYydkHDcXluDQr'
const ROOT_URL = 'https://api.nasa.gov/planetary/apod'

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wedesday', 'Thursday', 'Friday', 'Saturday']
let state = {
  month: moment().month(),
  year: moment().year()
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

function fetchAllImages(month, year) {
  let $el
  const promises = $('.day').map(function(index) {
    $el = $(this)
    let date = `${year}-${month + 1}-${$el.text()}`

    if (!$el.text().trim()) { return false }
    if ((moment().unix() - moment(date, 'YYYY-M-D').unix() < 0 )) { return false }

    return axios.get(ROOT_URL, {
      params: {
        api_key: API_KEY,
        date: date
      }
    })
  }).get()
  Promise.all(promises.map(reflect))
    .then(function(results) {
      state.results = results
      $('.day').each(function(index) {
        if (!results[index]) { return };
        $(this).attr('style', `background-image: url(${results[index].url}`);
      })
    })
}

function updateMonth(date) {
  if (date) {
    return $('.current-month').text(moment(date).format('MMM'))
  }
  return $('.current-month').text(moment().format('MMM'))
}

function reflect(promise) {
  if (!promise) {
    return null
  }
  return promise.then(
    function(response) {
      return response.data

      // if response.data.media_type === video? => get thumbnail
    },
    function(e) {
      return
  });
}

function buildCalendar() {
  const month = state.month
  const year = state.year
  const firstOfMonth = moment(`${year}-${month + 1}-1`, 'YYYY-M-D').day();
  let calendar = [];
  for (let i = 0; i < daysInMonth[month] + firstOfMonth; i++) {
    if (i < firstOfMonth) {
      calendar.push('')
    } else {
      calendar.push(i - firstOfMonth + 1)
    }
  }
  const calendarHtml = calendar.map(function(day) {
    return `<div class="day">${day}</div>`
  })
  while (calendarHtml.length % 7 !== 0) {
    calendarHtml.push('<div class="day"> </div>')
  }
  $('.week').html(calendarHtml)
  fetchAllImages(month, year)
  fetchMainImage()
  updateMonth()
}

function eventHandlers() {
  $('.open-btn').on('click', function() {
    $('aside').addClass('open');
  })

  $('.close-btn').on('click', function() {
    $('aside').removeClass('open');
  })

  $('.back-btn').on('click', function() {
    state.month = state.month - 1
    buildCalendar()
  })
}

function thumbnailClickHandler() {
  $('.week').on('click', '.day', function() {
    const index = $(this).index()
    const data = state.results[index]
    if (!data) { return }
    $('.modal-image').attr('style', `background-image: url(${data.hdurl}`)
    $('.modal-explanation').text(data.explanation)
    $('.melody-overlay').removeClass('hidden')
  })
}

function overlayClickHandler() {
  $('.melody-overlay').on('click', function() {
    $('.melody-overlay').addClass('hidden')
    var videoSource = $('.melody-overlay').find('iframe').attr('src')
    $('.melody-overlay').find('iframe').attr('src', videoSource)
  })
}

$(document).ready(function() {
  eventHandlers();
  buildCalendar();
  thumbnailClickHandler();
  overlayClickHandler();
})
