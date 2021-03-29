import Router from 'koa-router'

import DocumentController from '../../api/DocumentController'
const router = new Router()

router.prefix('/document')

router.post('/create', DocumentController.createDocument)
router.post('/update', DocumentController.updateDocument)
router.post('/delete', DocumentController.deleteDocument)
router.get('/get', DocumentController.getDocument)



export default router
