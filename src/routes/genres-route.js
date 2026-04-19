import express from 'express'
import asyncHandler from 'express-async-handler'
import * as controller from '../controllers/genres-controller.js'

const router = express.Router()

router.get('/', asyncHandler(controller.getGenres))

export default router
