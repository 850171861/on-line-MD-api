import { v4 as uuidv4 } from 'uuid'
import Project from '../model/Project'
import User from '../model/User'
import { getJwtVerify } from '../config/tokenConfig'

class ProjectController {
  // 创建项目
  async createdProject (ctx) {
    const { body } = ctx.request
    const token = ctx.header.authorization.split(' ')[1]
    const { _id } = await getJwtVerify(token)
    const projectData = new Project({
      uuid: uuidv4(),
      name: body.name,
      description: body.description,
      publics: body.publics,
      password: body.password,
      uid: _id,
      roles: body.roles
    })

    await projectData.save()
    ctx.body = {
      code: 200,
      msg: '创建成功'
    }
  }

  // 修改项目
  async updatedProject (ctx) {
    let { uuid, name, description, publics, password, uid, roles } = ctx.request.body
    if(publics == true){
      password = ''
    }
    const token = ctx.header.authorization.split(' ')[1]
    const { _id } = await getJwtVerify(token)
    const result = await Project.updateMany({ uuid: uuid }, {
      $set: {
        name,
        description,
        publics,
        password,
        uid,
        roles,
        uid:_id
      }
    })
    if (result.ok == 1) {
      ctx.body = {
        code: 200,
        msg: '修改成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '修改失败'
      }
    }
  }

  // 删除项目
  async deletedProject (ctx) {
    const { uuid } = ctx.request.body
    const result = await Project.deleteMany({ uuid })
    if (result.ok == 1) {
      ctx.body = {
        code: 200,
        msg: '删除成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '删除失败'
      }
    }
  }

  //  查询项目
  async getProject (ctx) {
    const { projectId } = ctx.query
    const token = ctx.header.authorization.split(' ')[1]
    const { _id } = await getJwtVerify(token)
    let result
    if (typeof projectId === 'undefined' && projectId == null) {
      result = await Project.find({ uid: _id }).sort({ created: -1 })
    } else {
      result = await Project.find({ _id: projectId, uid: _id }).sort({ created: -1 })
    }
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result
    }
  }

  // 获取项目成员
  async getMember (ctx) {
    const { body } = ctx.request
    console.log(body.uuid)
    const result = await Project.find({ uuid: body.uuid }).populate({
      path: 'uid',
      select: 'username name'
    })
      .sort({ created: -1 })
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result
    }
  }

  // 添加项目成员
  async addMember (ctx) {
    const { body } = ctx.request
    let response
    // 检查添加用户是否存在
    const user = await User.findOne({ _id: body.username })
    if (user == null && typeof user.username === 'undefined') {
      response.code = 500,
      response.msg = '添加成员不存在'
    } else {
      const projectData = new Project({
        uuid: body.uuid,
        name: body.name,
        publics: body.publics,
        password: body.password,
        uid: body.uid,
        roles: body.roles
      })

      await projectData.save()

      response.code = 200,
      response.msg = '添加成员成功'
    }
    ctx.body = response
  }

  // 删除项目成员
  async delMember (ctx) {
    const { uuid, uid } = ctx.request.body
    const result = await Project.deleteOne({ uuid, uid })
    ctx.body = {
      code: 200,
      msg: '删除成员成功'
    }
  }

  // 项目转让
  async transferProject (ctx) {
    const { body } = ctx.request.body
    // 检查被转让用户是否存在
    const transferUser = await User.findOne({ _id: body.transferuid })
    if (transferUser == null && typeof transferUser.username === 'undefined') {
      response.code = 500,
      response.msg = '转让用户不存在'
    }
    // 检查转让者当前用户密码
    const user = await User.findOne({ _id: body.uid })
    if (user.password !== body.userPassword) {
      response.code = 500,
      response.msg = '输入密码错误'
    } else {
      const result = await Project.updateOne({ uuid: uuid }, {
        $set: {
          name: body.name,
          description: body.description,
          publics: body.publics,
          password: body.password,
          uid: body.uid,
          roles: body.roles
        }
      })
      response.code = 200,
      response.msg = '转让成功'
    }
    ctx.body = response
  }
}

export default new ProjectController()
