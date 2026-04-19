/* eslint-env browser */
import { createHtmlElement } from './util.js'

function setMovie (movie) {
  document.title = `Editing ${movie.title} – Movies!`
  document.querySelector('h1.title').innerText = `Editing ${movie.title}`
  // document.querySelector('#movie').innerText = JSON.stringify(movie)

  for (const element of document.forms[0].elements) {
    const name = element.name
    const value = movie[name]

    if (name === 'genres') {
      const options = element.options
      for (let index = 0; index < options.length; index++) {
        const option = options[index]
        option.selected = value.indexOf(option.value) >= 0
      }
    } else {
      element.value = value
    }
  }
}

function getMovie () {
  const movie = {}

  const elements = Array.from(document.forms[0].elements).filter(
    element => element.name
  )

  for (const element of elements) {
    const name = element.name

    let value

    if (name === 'genres') {
      value = []
      const options = element.options
      for (let index = 0; index < options.length; index++) {
        const option = options[index]
        if (option.selected) {
          value.push(option.value)
        }
      }
    } else if (
      name === 'metascore' ||
      name === 'runtime' ||
      name === 'imdbRating'
    ) {
      value = Number(element.value)
    } else if (
      name === 'actors' ||
      name === 'directors' ||
      name === 'writers'
    ) {
      value = element.value
        .split(',')
        .map(item => item.trim())
        .filter(item => Boolean(item))
    } else {
      value = element.value
    }

    movie[name] = value
  }

  return movie
}

function putMovie () {
  /* Task 3.3.
    - Get the movie data using getMovie()
    - Configure the XMLHttpRequest to make a PUT to /movies/:imdbID
    - Set the 'Content-Type' appropriately for JSON data
    - Configure the function below as the onload event handler
    - Send the movie data as JSON
  */
  console.log(getMovie())
  const movie = getMovie()

  const xhr = new XMLHttpRequest()
  xhr.open('PUT', `/movies/${imdbID}`)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 204) {
      location.href = 'index.html'
    } else {
      alert(
        `Saving of movie data failed. Status code was ${xhr.status}.` +
          `\n\n${xhr.response}\n\n` +
          'Check the browser console for more details.'
      )
      console.error(`Could not PUT /movies/${imdbID}`, xhr)
    }
  }
  xhr.send(JSON.stringify(movie))
}

/** Loading and setting the movie data for the movie with the passed imdbID */
const imdbID = new URLSearchParams(window.location.search).get('imdbID')

const xhr = new XMLHttpRequest()
xhr.open('GET', `/movies/${imdbID}`)
xhr.onload = function () {
  const serverErrorElement = document.querySelector('#server-error')
  if (xhr.status === 200) {
    const responseJSON = JSON.parse(xhr.responseText)
    console.log(responseJSON)

    serverErrorElement.hidden = true
    document.querySelector('#movie').hidden = false
    document
      .querySelector('#movie-form__button--save')
      .addEventListener('click', putMovie)

    setMovie(responseJSON)
  } else {
    serverErrorElement.classList = 'movies movies__error'
    const li = createHtmlElement('section')
    li.append(
      createHtmlElement('h2', null, `${xhr.status} • ${xhr.statusText}`),
      createHtmlElement('p', null, "Could not load this movie's data")
    )
    serverErrorElement.append(li)
    console.error("Could not load this movie's data", xhr)
  }
}

xhr.send()

// const form = document.querySelector('form')
// let isDirty = false

// form.addEventListener('input', () => {
//   isDirty = true
// })

// window.addEventListener('beforeunload', e => {
//   if (!isDirty) return

//   e.preventDefault()
//   e.returnValue = ''
// })
