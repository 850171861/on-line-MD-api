import Directory from '../model/Directory'
import DirectoryItem from '../model/DirectoryItem'
import { v4 as uuidv4 } from 'uuid'

class DirectoryController {
  // 创建目录
  async createDirectory(ctx) {
    const { body } = ctx.request

    const DirectoryData = new Directory({
      projectId: body.projectId,
      directory: [ { name: body.name, id: uuidv4() }]
    })
    await DirectoryData.save()
    ctx.body = {
      code: 200,
      msg: '添加成功'
    }
  }

  // 查询目录
  async getDirectory(ctx) {
    const { projectId } = ctx.request.body
    const result = await Directory.aggregate([
      {
        $match: { projectId: projectId }
      },
      {
        $lookup: {
          from: 'directory_items',
          localField: 'directory.id',
          foreignField: 'directoryId',
          as: 'children'
        }
      },
      {
        $unwind: '$directory'
      }
    ])
    console.log(result)
    // 修改数据结构
    result.forEach(element => {
      element.children.forEach(element1 => {
        if (element.directory.id == element1.directoryId) {
          element.children = []
          element.children.push(element1)
        }
      })
    })



    

    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result
    }
  }

  // 修改目录
  async updateDirectory(ctx) {
    const { body } = ctx.request
    const a =await Directory.updateOne(
      { projectId: body.projectId, 'directory.id': body.directory_id },
      {
        $set: {
          'directory.$.name': body.name
        }
      }
    )
console.log(a)
    ctx.body = {
      code: 200,
      msg: '修改成功'
    }
  }

  // 删除目录
  async deleteDirectory(ctx) {
    const { body } = ctx.request
   
    await Directory.update({ projectId: body.projectId }, {
      $pull: {
        directory: {
          id: body.directory_id
        }
      }
    }, {
      multi: true
    })
    ctx.body = {
      code: 200,
      msg: '删除成功'
    }
  }

  // 创建子目录
  async createDirectoryChildren(ctx) {
    const { body } = ctx.request

    const DirectoryChildren = new DirectoryItem({
      directoryId: body.directoryId,
      directory_item: [
        { name: 'page1', id: uuidv4() }
      ]
    })
    await DirectoryChildren.save()
    ctx.body = {
      code: 200,
      msg: '添加成功'
    }
  }

  // 修改子目录
  async updateDirectoryChildren(ctx) {
    const { body } = ctx.request
    await DirectoryItem.updateOne(
      { directoryId: body.directoryId, 'directory_item.id': body.directory_item_id },
      {
        $set: {
          'directory_item.$.name': body.name
        }
      }
    )

    ctx.body = {
      code: 200,
      msg: '修改成功'
    }
  }

  // 删除子目录
  async deleteDirectoryChildren(ctx) {
    const { body } = ctx.request

    await DirectoryItem.updateOne({ directoryId: body.directoryId }, {
      $pull: {
        directory_item: {
          id: body.directory_item_id
        }
      }
    }, {
      multi: true
    })
    ctx.body = {
      code: 200,
      msg: '删除成功'
    }
  }
}

export default new DirectoryController()
