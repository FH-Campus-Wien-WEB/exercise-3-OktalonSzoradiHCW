import * as moviesModel from '../models/movies-model.js'

let genres = []

export async function getGenresJson () {
  let collectedGenres = []

  const movies = await moviesModel.getMoviesJson()

  for (const movie of movies) {
    for (const genre of movie.genres) {
      if (!collectedGenres.includes(genre)) {
        collectedGenres.push(genre)
      }
    }
  }

  collectedGenres = collectedGenres.sort()

  if (JSON.stringify(genres) !== JSON.stringify(collectedGenres)) {
    genres = collectedGenres
  }

  return genres
}
