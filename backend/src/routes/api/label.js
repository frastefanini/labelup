import i18n from 'i18n'
import express from 'express'

import { getAllLabels, modifyLabels } from '../../services/labels'
import LabelUpError from '../../utils/error'

const router = express.Router({
  mergeParams: true
})

router.get('/', async (req, res, next) => {
  const clientKey = req.context.clientKey
  const content = req.context.context.confluence.content

  if(!clientKey || !content) {
    const code = 'GN12'
    next(new LabelUpError(i18n.__(`generic.${code}`)))

    return
  }

  let labels
  try {
    labels = await getAllLabels(clientKey, content.id)
  } catch (err) {
    next(err)
    return
  }
  res.send(labels)
})

router.put('/', async (req, res, next) => {
  const clientKey = req.context.clientKey
  const content = req.context.context.confluence.content
  const body = req.body
  let input
  if(body) {
    input = body.labels
  }

  if(!input) {
    const code = 'LE05'
    next(new LabelUpError(i18n.__(`generic.${code}`)), code)

    return
  }

  if(!clientKey || !content) {
    const code = 'GN12'
    next(new LabelUpError(i18n.__(`generic.${code}`)))

    return
  }

  let labels
  try {
    labels = await modifyLabels(clientKey, content.id, input)
  } catch (err) {
    next(err)
    return
  }
  res.send(labels)
})

export default router
