import * as model from '../models/genres-model.js'

export async function getGenres (req, res) {
  const genres = await model.getGenresJson()

  return res.status(200).json(genres)
}
