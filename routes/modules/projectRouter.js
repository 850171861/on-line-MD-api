import Router from 'koa-router'
const router = new Router()

import ProjectController from '../../api/ProjectController'

router.prefix('/project')


router.post('/create', ProjectController.createdProject)
router.post('/update', ProjectController.updatedProject)
router.post('/delete', ProjectController.deletedProject)


router.post('/getMember', ProjectController.getMember)
router.post('/addMember', ProjectController.addMember)
router.post('/delMember', ProjectController.delMember)
router.post('/transferProject', ProjectController.transferProject)



export default router
