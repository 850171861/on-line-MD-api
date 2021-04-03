import { v4 as uuidv4 } from 'uuid'
import Project from '../model/Project'
import User from '../model/User'
import dayjs from 'dayjs'
import { getJwtVerify } from '../config/tokenConfig'

class ProjectController {
  // 创建项目
  async createdProject(ctx) {
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
  async updatedProject(ctx) {
    let { uuid, name, description, publics, password, uid, roles } = ctx.request.body
    if (publics == true) {
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
        uid: _id
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
  async deletedProject(ctx) {
    const { uuid,name,password } = ctx.request.body
    const token = ctx.header.authorization.split(' ')[1]
    const { _id } = await getJwtVerify(token)
    const  projectName  = await Project.findOne({uuid,name,uid:_id})
    const user = await User.findOne({_id})
    if(projectName === null){
      ctx.body = {
        code:500,
        msg:'项目名称不存在'
      }
      return
    }
    if(user.password !== password){
       ctx.body = {
        code:500,
        msg:'密码错误'
      }
      return
    }

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
  async getProject(ctx) {
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
  async getMember(ctx) {
    const { uuid } = ctx.query

    let result = await Project.find({ uuid: uuid }).populate({
      path: 'uid',
      select: 'username name'
    })
      .sort({ created: -1 })

    result = result.map(item => {
      return {
        id: item._id,
        username: item.uid.username,
        name: item.uid.name,
        created: dayjs(item.created).format('YY-MM-DD HH:mm'),
        roles: item.roles
      }
    })

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result
    }
  }

  // 添加项目成员
  async addMember(ctx) {
    const { body } = ctx.request
    const response = {}
    // 检查添加用户是否存在
    const user = await User.findOne({ username: body.username })
    if (user === null) {
      response.code = 500
      response.msg = '添加成员不存在'
    } else {
      // 检查用户是否存在当前项目组
      const projectMember = await Project.findOne({ uid: user._id, uuid: body.uuid })
      if (projectMember === null) {
        const projectData = new Project({
          uuid: body.uuid,
          name: body.name,
          description: body.description,
          publics: body.publics,
          password: body.password,
          uid: user._id,
          roles: body.roles
        })
        const member = await projectData.save()
        const data = {}
        data.id = member._id,
          data.username = user.username,
          data.name = user.name,
          data.created = dayjs(member.created).format('YY-MM-DD HH:mm'),
          data.roles = member.roles
        console.log(data)
        response.code = 200
        response.msg = '添加成员成功'
        response.data = data
      } else {
        response.code = 501
        response.msg = '成员已存在项目中'
      }
    }
    ctx.body = response
  }

  // 删除项目成员
  async delMember(ctx) {
    const { id, uuid } = ctx.request.body
    const result = await Project.deleteOne({ _id: id, uuid })

    ctx.body = {
      code: 200,
      msg: '删除成员成功'
    }
  }

  // 项目转让
  async transferProject(ctx) {
    const { body } = ctx.request
    // 检查被转让用户是否存在
    const transferUser = await User.findOne({ username: body.username })
    if (transferUser === null) {
      ctx.body = {
        code: 501,
        msg: '转让用户不存在'
      }
      return
    }
    // 当前项目不给转让给自己
    const token = ctx.header.authorization.split(' ')[1]
    const { _id } = await getJwtVerify(token)
    if(transferUser._id == _id){
      ctx.body = {
        code:502,
        msg:'项目不能转让给自己'
      }
      return
    }

    // 检查转让者当前用户密码
    const { password } = await User.findOne({ _id })
    if (password !== body.password) {
      ctx.body = {
        code: 502,
        msg: '密码不正确'
      }
    } else {
      // 检查被转让用户是否在当前项目里
      const transferUsers = await Project.findOne({ uid: transferUser._id })
      // 项目信息
      const projectInfo = await Project.findOne({ uid: _id, uuid: body.uuid })
      if (transferUsers !== null) {
        await Project.updateOne({ uid: transferUser._id, uuid: body.uuid }, {
          $set: {
            roles: projectInfo.roles
          }
        })
        
        await Project.deleteOne({ uid: _id, uuid: body.uuid })
        ctx.body = {
          code: 200,
          msg: '转让成功'
        }
      } else {
        await Project.updateOne({ uid: _id, uuid: body.uuid }, {
          $set: {
            uid: transferUser._id
          }
        })
        ctx.body = {
          code: 200,
          msg: '转让成功'
        }
      }
    }
  }
}

export default new ProjectController()
