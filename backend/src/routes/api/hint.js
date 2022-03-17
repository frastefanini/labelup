import express from 'express'
import i18n from 'i18n'

import { requestHints } from '../../services/hints'
import LabelUpError from '../../utils/error'

const router = express.Router({
  mergeParams: true
})

router.post('/', async (req, res, next) => {
  const clientKey = req.context.clientKey
  const content = req.context.context.confluence.content
  const userAccountId = req.context.userAccountId

  if(!clientKey || !content || !userAccountId) {
    const code = 'GN12'
    next(new LabelUpError(i18n.__(`generic.${code}`)))

    return
  }

  let result
  try {
    result = await requestHints(clientKey, content, userAccountId)
  } catch (err) {
    next(err)
    return
  }

  if(result) {
    const message = i18n.__(`generic.GP01`)
    res.send({ message })
  } else {
    next(new LabelUpError(i18n.__(`generic.GN11`)))
  }
})

export default router
