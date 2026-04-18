import colors from 'colors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'

import moviesRoute from './routes/movies-route.js'

const PORT = 3000

const dirname = path.resolve()

const app = express()

app.use(morgan('dev'))
app.use(express.static(path.join(dirname, '/public')))
app.use(express.json())

app.use('/movies', moviesRoute)

app.listen(PORT, () => {
  console.log(
    colors.blue(`[ i ] Server now listening on http://localhost:${PORT}/`)
  )
})
