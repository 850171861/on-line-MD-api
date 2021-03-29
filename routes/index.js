import combineRoutes from 'koa-combine-routers'

// 引入路由
import loginRouter from './modules/loginRouter'
import projectRouter from './modules/projectRouter'
import directoryRouter from './modules/directoryRouter'
import documentRouter from './modules/documentRouter'
// 使用combineRoutes组合多个路由的实例
export default combineRoutes(
  loginRouter,
  projectRouter,
  directoryRouter,
  documentRouter
)
