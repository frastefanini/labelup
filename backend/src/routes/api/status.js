import express from 'express'

import { getStatus } from '../../services/status'

const router = express.Router({
  mergeParams: true
})

router.get('/', async (req, res, next) => {
  const content = req.context.context.confluence.content
  const clientKey = req.context.clientKey
  let status
  try {
    status = await getStatus(clientKey, content)
  } catch (err) {
    next(err)
    return
  }
  res.send(status)
})

export default router
