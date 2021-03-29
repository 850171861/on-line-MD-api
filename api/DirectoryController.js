import Directory from '../model/Directory'
import DirectoryItem from '../model/DirectoryItem'
import { v4 as uuidv4 } from 'uuid'

class DirectoryController {
  // 创建目录
  async createDirectory(ctx) {
    const { body } = ctx.request

    const DirectoryData = new Directory({
      projectId: '606133d905d1c44e3800e488',
      directory: [
        { name1: 'page1', id: uuidv4() },
        { name2: 'page2', id: uuidv4() }
      ]
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
    await Directory.updateOne(
      { projectId: body.projectId, 'directory.id': body.directory_id },
      {
        $set: {
          'directory.$.name': body.name
        }
      }
    )

    ctx.body = {
      code: 200,
      msg: '修改成功'
    }
  }

  // 删除目录
  async deleteDirectory(ctx) {
    const { body } = ctx.request

    await Directory.updateOne({ projectId: body.projectId }, {
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
      directoryId: '60617b8b8628f9200c858620',
      directory_item: [
        { name1: 'page1', id: uuidv4() },
        { name2: 'page2', id: uuidv4() }
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
