import express from 'express'

import addon from '../../addon'
import checkValidLicense from '../../middlewares/license'

import labelRouter from './label'
import hintRouter from './hint'
import statusRouter from './status'

const router = express.Router()
router.use(addon.checkValidToken())
router.use(checkValidLicense())

router.use('/content/:contentId/label', labelRouter)
router.use('/content/:contentId/hint', hintRouter)
router.use('/content/:contentId/status', statusRouter)

export default router
