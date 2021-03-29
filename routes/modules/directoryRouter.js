import Router from 'koa-router'

import DirectoryController from '../../api/DirectoryController'
const router = new Router()

router.prefix('/directory')

router.post('/create', DirectoryController.createDirectory)
router.post('/getDirectory', DirectoryController.getDirectory)
router.post('/update', DirectoryController.updateDirectory)
router.post('/delete', DirectoryController.deleteDirectory)

// 子目录
router.post('/create/children', DirectoryController.createDirectoryChildren)
router.post('/update/children', DirectoryController.updateDirectoryChildren)
router.post('/delete/children', DirectoryController.deleteDirectoryChildren)
export default router
