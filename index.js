import Koa from 'koa'
const app = new Koa();
import router from './routes/index.js'
import compose from 'koa-compose'
import koaBody from 'koa-body'



 

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
  }))
 ])
 app.use(middleware)
 app.use(router())

app.listen(3000,()=>{
    console.log('port 3000');
});