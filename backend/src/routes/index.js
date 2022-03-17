import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.redirect('/atlassian-connect.json')
})

export default router
