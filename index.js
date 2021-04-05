import Koa from 'koa'
import router from './routes/index.js'
import compose from 'koa-compose'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import JWT from 'koa-jwt'
import { JWT_SECRET } from './config/tokenConfig'
const app = new Koa()

// 定义公共路径 不需要jwt鉴权
const jwt = JWT({ secret: JWT_SECRET }).unless({
  path: [/^\/project/, /^\/directory/, /^\/login/,]
})

// 使用koa-compose 集成所有中间件
const middleware = compose([
  // post请求和图片上传
  (koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024
    },
    onError: err => {
      console.log('koabody', err)
    }
  })),
  cors(),
  jwt
])
app.use(middleware)
app.use(router())

app.listen(3000, () => {
  console.log('port 3000')
})
