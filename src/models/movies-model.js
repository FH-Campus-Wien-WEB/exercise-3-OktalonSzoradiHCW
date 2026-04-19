// import movies from '../movies.json' with { type: 'json' }
import fs from 'fs'
import path from 'path'

const filePath = path.resolve('./src/movies.json')
const rawMovies = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const formattedMovies = rawMovies.map(
  ({
    imdbID,
    Title,
    Released,
    Runtime,
    Genre,
    Director,
    Writer,
    Actors,
    Plot,
    Poster,
    Metascore,
    imdbRating
  }) => ({
    imdbID,
    title: Title,
    released: dateToISO8601format(Released),
    runtime: Number.parseInt(Runtime),
    genres: Genre.split(', ').map(g => g.replace(/-/g, '\u2011')),
    directors: Director.split(', '),
    writers: Writer.split(', '),
    actors: Actors.split(', '),
    plot: Plot,
    poster: Poster,
    Metascore: Number(Metascore),
    imdbRating: Number(imdbRating)
  })
)

function dateToISO8601format (input) {
  const date = input instanceof Date ? input : new Date(input)

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export async function getMoviesJson (genre) {
  if (genre && genre.toLowerCase() !== 'all') {
    return formattedMovies.filter(movie => movie.genres.includes(genre))
  }

  return formattedMovies
}

export async function getMovieJson (imdbID) {
  const movie = formattedMovies.find(m => m.imdbID === imdbID)

  return movie
}

export async function editMovieJson (
  imdbID,
  // {
  //   Title,
  //   Released,
  //   Runtime,
  //   Genres,
  //   Directors,
  //   Writers,
  //   Actors,
  //   Plot,
  //   Poster,
  //   Metascore,
  //   imdbRating
  // }
  newMovie
) {
  const movieIndex = formattedMovies.indexOf(
    formattedMovies.find(movie => movie.imdbID === imdbID)
  )
  const movie = { ...formattedMovies[movieIndex] }

  if (!movie) return movie

  const whatWasChanged = []

  for (const newMovieProperty in newMovie) {
    if (newMovie[newMovieProperty] !== movie[newMovieProperty]) {
      movie[newMovieProperty] = newMovie[newMovieProperty]
      whatWasChanged.push(newMovieProperty)
    }
  }

  formattedMovies[movieIndex] = movie

  return movie
}
