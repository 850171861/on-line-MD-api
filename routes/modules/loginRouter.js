import Router from 'koa-router'
import loginController from '../../api/LoginController'

const router = new Router()

router.prefix('/login')
// 验证码
router.post('/ver', loginController.ver)
// 注册用户
router.post('/reg', loginController.reg)
// 用户登录
router.post('/login', loginController.login)
// 密码重置
router.post('/reset', loginController.reset)

export default router
