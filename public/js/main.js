/* eslint-env browser */
import { createHtmlElement } from './util.js'

/**
 * @typedef {Object} Movie
 * @property {string} title
 * @property {string} released
 * @property {number | string} runtime
 * @property {string[]} genres
 * @property {string[]} directors
 * @property {string[]} writers
 * @property {string[]} actors
 * @property {string} plot
 * @property {string} poster
 * @property {number} metascore
 * @property {number} imdbRating
 */

/**
 * Creates a <ul> element populated with <li> items.
 *
 * @param {string[]} items - List of text items to render.
 * @param {string} listClass - CSS class for the <ul>.
 * @param {string} itemClass - CSS class for each <li>.
 * @returns {HTMLUListElement} The generated unordered list.
 */
function createList (items, listClass, itemClass) {
  const ul = document.createElement('ul')
  ul.className = listClass

  // for (const item of items) {
  //   const li = createHtmlElement('li', itemClass, item)
  //   ul.appendChild(li)
  // }

  ul.append(...items.map(item => createHtmlElement('li', itemClass, item)))

  return ul
}

/**
 * Creates a section consisting of a header (<h3>) and a list.
 *
 * @param {string} title - Base title for the section (e.g. "Director").
 * @param {string[]} items - Items to include in the list.
 * @param {string} listClass - CSS class for the <ul>.
 * @param {string} itemClass - CSS class for each <li>.
 * @returns {DocumentFragment} A fragment containing the header and list.
 */
function createSection (title, items, listClass, itemClass) {
  const fragment = document.createDocumentFragment()

  const header = createHtmlElement(
    'h3',
    null,
    `${title}${items.length > 1 ? 's' : ''}`
  )

  const list = createList(items, listClass, itemClass)

  fragment.appendChild(header)
  fragment.appendChild(list)

  return fragment
}

/**
 * Creates a complete movie card list item element.
 *
 * @param {Movie} movie - Movie data used to populate the card.
 * @returns {HTMLLIElement} An <li> element containing the movie card.
 */
function createMovieCard (movie) {
  const li = createHtmlElement('li', 'movies__li')
  const movieCard = createHtmlElement('article', 'movie')
  li.appendChild(movieCard)

  const imageWrapper = createHtmlElement('picture', 'movie__poster-area')
  const image = createHtmlElement('img', 'movie__poster')
  image.src = movie.poster
  image.alt = `Movie poster for ${movie.title}`
  imageWrapper.appendChild(image)

  const title = createHtmlElement('h2', 'movie__title', movie.title)

  const metadata = createHtmlElement(
    'span',
    'movie__runtime-and-release',
    /* eslint-disable no-irregular-whitespace */
    [
      `${movie.runtime ? `Runtime: ${movie.runtime} minutes` : ''}`,
      `Released: ${movie.released}`,
      `${movie.metascore ? `Metascore: ${movie.metascore}` : ''}`,
      `${movie.imdbRating ? `IMDb Rating: ${movie.imdbRating}` : ''}`
    ]
      .filter(md => Boolean(md))
      .join(' • ')
    /* eslint-enable no-irregular-whitespace */
  )

  const genres = createList(movie.genres, 'movie__genres', 'movie__genre')

  const description = createHtmlElement('p', 'movie__description', movie.plot)

  const directors = createSection(
    'Director',
    movie.directors,
    'movie__directors',
    'movie__director'
  )

  const writers = createSection(
    'Writer',
    movie.writers,
    'movie__writers',
    'movie__writer'
  )

  const actors = createSection(
    'Actor',
    movie.actors,
    'movie__actors',
    'movie__actor'
  )

  const buttonArea = createHtmlElement('footer', 'movie__button-area')
  const buttonEdit = createHtmlElement('a', 'movie__button', 'Edit')
  buttonEdit.href = `/edit.html?imdbID=${movie.imdbID}`
  buttonEdit.addEventListener('click', () => {
    buttonEdit.classList.toggle('movie__button--active')
    setTimeout(() => {
      buttonEdit.classList.toggle('movie__button--active')
    }, 1000)
  })
  buttonArea.appendChild(buttonEdit)

  movieCard.append(
    imageWrapper,
    title,
    metadata,
    genres,
    description,
    directors,
    writers,
    actors,
    buttonArea
  )

  return li
}

function makeGenre (genre) {
  const genres = document.querySelector('#genres')
  const genreFilter = createHtmlElement('li')
  const genreFilterButton = createHtmlElement('button', 'genre__button', genre)
  genreFilterButton.type = 'button'
  genreFilterButton.addEventListener('click', () => {
    const xhr2 = new XMLHttpRequest()
    xhr2.onload = () => {
      const movies = document.querySelector('#movies')
      movies.innerHTML = ''
      const response = JSON.parse(xhr2.responseText)
      for (const movie of response) {
        movies.appendChild(createMovieCard(movie))
      }
    }
    xhr2.open('GET', `/movies?genre=${genre}`)
    xhr2.send()
  })
  genreFilter.appendChild(genreFilterButton)
  genres.appendChild(genreFilter)
}

function handleGenres () {
  const xhr = new XMLHttpRequest()
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText)
      makeGenre('All')
      for (const genre of response) {
        makeGenre(genre)
      }
    } else {
      console.error('Could not GET /genres', xhr)
    }
  }
  xhr.open('GET', '/genres')
  xhr.send()
}

window.onload = () => {
  const xhr = new XMLHttpRequest()
  xhr.onload = () => {
    const movies = document.querySelector('#movies')
    if (xhr.status === 200) {
      const errorMessage = document.querySelector('#server-error')
      errorMessage.remove()
      const response = JSON.parse(xhr.responseText)
      handleGenres()
      for (const movie of response) {
        movies.appendChild(createMovieCard(movie))
      }
    } else {
      movies.classList = 'movies movies__error'
      const li = createHtmlElement('li')
      li.append(
        createHtmlElement('h2', null, `${xhr.status} • ${xhr.statusText}`),
        createHtmlElement('p', null, 'Could not GET /movies')
      )
      movies.append(li)
      console.error('Could not GET /movies', xhr)
    }
  }
  xhr.open('GET', '/movies')
  xhr.send()
}
