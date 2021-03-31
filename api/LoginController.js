import User from '../model/User'
import Ver from '../model/Ver'
import send from '../config/emailConfig'
import moment from 'dayjs'
import jwt from 'jsonwebtoken'
class UserController {
  // 发送验证码
  async ver (ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    // 生产随机验证码4位
    const charactors = '0123456789'
    let verCode = ''
    let i = ''
    for (let j = 1; j <= 4; j++) {
      i = parseInt(10 * Math.random())
      verCode = verCode + charactors.charAt(i)
    }
    // 存储当前注册的邮箱和验证码
    const verData = new Ver({
      username: body.username,
      ver: verCode
    })
    const ver = await verData.save()

    // 区别是注册还是找回密码
    let type
    if (typeof body.name !== 'undefined') {
      type = { type: 'reg' }
    } else {
      type = { type: 'reset' }
    }
    // 发送邮件-验证码
    const result = await send({
      type: type.type,
      expire: moment()
        .add(10, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'),
      email: body.username,
      ver: verCode
    })
    ctx.body = {
      code: 200,
      msg: '邮件发送成功'
    }
  }

  // 注册接口
  async reg (ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    const response = {}
    // 校验验证码的内容和时效性
    const ver = await Ver.findOne({ username: body.username }).sort({ created: -1 })
    // ver为空证明用户没有发送认证码
    if (ver === null) {
      response.code = 500
      response.msg = '验证码错误或者已失效，请重新获取！'
    } else {
      const verTime = moment(ver.created).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      if (verTime > time && ver.ver === body.ver) {
        // 查库，看username是否被注册
        const user = await User.findOne({ username: body.username })
        if (user !== null && typeof user.username !== 'undefined') {
          response.code = 500
          response.msg = '此邮箱已经注册，可以通过邮箱找回密码'
        } else {
          const user = new User({
            username: body.username,
            name: body.name,
            password: body.password
          })
          const result = await user.save()

          // 成功之后清空验证码信息
          const deleteVer = await Ver.deleteMany({ username: body.username })
          response.code = 200
          response.msg = '注册成功'
        }
      } else {
        response.code = 500
        response.msg = '验证码错误或者已失效，请重新获取！'
      }
    }

    ctx.body = response
  }

  // 登录接口
  async login (ctx) {
    const { username, password } = ctx.request.body
    const userData = await User.findOne({ username, password })
    if (userData === null) {
      ctx.body = {
        code: 404,
        msg: '用户名或者密码错误'
      }
      return
    }
    const token = jwt.sign({
      _id: userData._id
    }, 'wmaw1i0IdL1l1o%OUOTo$Zwgsjmflaw%Fwq', {
      expiresIn: '7d'
    })

    // 删除不需要返回的字段
    const userObj = userData.toJSON()
    const arr = ['_id', 'password', 'created']
    arr.map((item) => {
      delete userObj[item]
    })

    ctx.body = {
      code: 200,
      data: userObj,
      token: token,
      msg: '登录成功'
    }
  }

  // 重置密码
  async reset (ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    const response = {}
    // 查询用户验证码信息
    const ver = await Ver.findOne({ username: body.username }).sort({ created: -1 })
    // ver为空证明用户没有发送认证码
    if (ver === null) {
      response.code = 500
      response.msg = '验证码错误或者已失效，请重新获取！'
    } else {
      // 校验验证码的内容和时效性
      const verTime = moment(ver.created).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      const time = moment().format('YYYY-MM-DD HH:mm:ss')
      if (verTime > time && ver.ver === body.ver) {
        await User.updateOne({
          username: body.username
        }, {
          password: body.password
        })

        // 成功之后清空验证码信息
        const deleteVer = await Ver.deleteMany({ username: body.username })
        response.code = 200
        response.msg = '密码重置成功'
      } else {
        response.code = 500
        response.msg = '验证码错误或者已失效，请重新获取！'
      }
    }

    ctx.body = response
  }
}

export default new UserController()
