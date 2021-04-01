import Router from 'koa-router'

import ProjectController from '../../api/ProjectController'
const router = new Router()

router.prefix('/project')

router.post('/create', ProjectController.createdProject)
router.post('/update', ProjectController.updatedProject)
router.post('/delete', ProjectController.deletedProject)
router.get('/get', ProjectController.getProject)

router.post('/getMember', ProjectController.getMember)
router.post('/addMember', ProjectController.addMember)
router.post('/delMember', ProjectController.delMember)
router.post('/transferProject', ProjectController.transferProject)

export default router
