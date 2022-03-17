import express from 'express'
import http from 'http'
import path from 'path'

import app from './app'
import cache from './middlewares/cache'
import handleErrorResponse from './middlewares/error'
import router from './routes'
import apiRouter from './routes/api'

// Wire up routes
app.use('/', router)
app.use('/api', apiRouter)
app.use('/api', handleErrorResponse())

// Serve client app
const clientDistDir = path.join(__dirname, '..', '..', 'client', 'dist')
app.use('/app', cache())
app.use('/app', express.static(clientDistDir, { etag: false }))

// Mount the static files directory
const publicDir = path.join(__dirname, '..', 'public')
app.use('/static', cache())
app.use('/static', express.static(publicDir, { etag: false }))

// Create the HTTP server
export default http.createServer(app)
