import Router from 'koa-router'

import DirectoryController from '../../api/DirectoryController'
const router = new Router()

router.prefix('/directory')

router.post('/create', DirectoryController.createDirectory)
router.post('/get', DirectoryController.getDirectory)
router.post('/update', DirectoryController.updateDirectory)
router.post('/delete', DirectoryController.deleteDirectory)


export default router
