import Router from 'koa-router'
const router = new Router()

import DirectoryController from '../../api/DirectoryController'

router.prefix('/directory')



router.post('/create', DirectoryController.createDirectory)
router.post('/getDirectory', DirectoryController.getDirectory)
router.post('/update', DirectoryController.updateDirectory)



export default router
