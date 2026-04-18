import express from 'express'
import asyncHandler from 'express-async-handler'
import * as controller from '../controllers/movies-controller.js'

const router = express.Router()

router.get('/', asyncHandler(controller.getMovies))
router.get('/:imdbID', asyncHandler(controller.getMovie))
router.put('/:imdbID', asyncHandler(controller.editMovie))

export default router
