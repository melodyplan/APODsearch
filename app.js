const API_KEY = 'GHtmvSXNIA94h6fHzpAR8qxHQsNYydkHDcXluDQr'
const ROOT_URL = 'https://api.nasa.gov/planetary/apod'

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wedesday', 'Thursday', 'Friday', 'Saturday']
let state = {
  month: moment().month() + 1,
  year: moment().year()
}
console.log(state)
var youtube_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(query) {
  axios.get(youtube_URL, {
    params: {
      part: 'snippet',
      key: 'AIzaSyABEG1EiZyTt2kxzYWbcU2Nhka23N538Sg',
      q: query
    }
  })
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

function fetchAllImages() {
  let $el
  const promises = $('.day').map(function(index) {
    $el = $(this)
    let date = `${state.year}-${state.month}-${$el.text()}`

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
        if (results[index].media_type === 'image') {
          $(this).attr('style', `background-image: url(${results[index].url}`)
        } else if (results[index].media_type === 'video') {
          console.log(results[index].url)
          $(this).attr('style', `background-image: url('https://img.youtube.com/vi/${results[index].url.split('/')[4].split('?')[0]}/0.jpg'`)
        }
      })
    })
}

function updateMonth(date) {
  return $('.current-month').text(moment(`${state.year}-${state.month}-1`, 'YYYY-M-D').format('MMM'))
}

function nextMonth(date) {
  state.month ++
  buildCalendar()
}

function prevMonth(date) {
  state.month --
  buildCalendar()
}


function updateYear(date) {
  if (date) {
    return $('.current-year').text(moment(date).format('YYYY'))
  }
  return $('.current-year').text(moment().format('YYYY'))
}

// function previousMonth(date) {
//   if (date) {
//     return $('.current-month').moment().subtract(1, 'months').format('MMM')
//   }
// }

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
  const year = state.year
  const firstOfMonth = moment(`${state.year}-${state.month}-1`, 'YYYY-M-D').day();
  let calendar = [];
  for (let i = 0; i < daysInMonth[state.month] + firstOfMonth; i++) {
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
  fetchAllImages()
  fetchMainImage()
  updateMonth()
  updateYear()
}

function eventHandlers() {
  $('.open-btn').on('click', function() {
    $('aside').addClass('open');
  })

  $('.close-btn').on('click', function() {
    $('aside').removeClass('open');
  })

  $('.back-btn').on('click', function() {
    prevMonth()
    buildCalendar()
  })

  $('.forward-btn').on('click', function() {
    nextMonth()
    buildCalendar()
  })
}

function thumbnailClickHandler() {
  $('.week').on('click', '.day', function() {
    const index = $(this).index()
    const data = state.results[index]
    if (!data) { return }
    if (data.media_type === 'image') {
      $('.modal-image').attr('style', `background-image: url(${data.url}`).html('')
    } else if (data.media_type === 'video') {
      $('.modal-image').html(`<iframe width="960" height="540" src="${data.url}" frameborder="0" allowfullscreen></iframe>`)
    }
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
