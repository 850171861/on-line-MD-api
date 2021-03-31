import Document from '../model/Document'
import DirectoryItem from '../model/DirectoryItem'
import Directory from '../model/Directory'
import mongoose from 'mongoose'
class DocumentController {
  // 创建文档
  async createDocument (ctx) {
    const session = await mongoose.startSession()
    session.startTransaction()
    const { body } = ctx.request
    try {
      //  事务 - 数据一致性
      const md = new Document({
        title: body.title,
        content: body.content
      })
      await md.save()
      if (typeof body.directoryId !== 'undefined' && body.directoryId !== '') {
        console.log(1)
        await DirectoryItem.updateOne({
          directoryId: body.directoryId
        }, {
          $push: {
            directory_item: {
              $each: [{
                id: mongoose.Types.ObjectId(md._id).toString(),
                name: md.title
              }],
              $position: 0
            }
          }
        })
      } else {
        await Directory.updateOne({
          projectId: body.projectId
        }, {
          $push: {
            directory: {
              $each: [{
                id: mongoose.Types.ObjectId(md._id).toString(),
                name: md.title,
                page: true
              }],
              $position: 0
            }
          }
        })
      }
      ctx.body = {
        code: 200,
        msg: '添加成功'
      }
      await session.commitTransaction()
      session.endSession()
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      ctx.body = {
        code: 500,
        msg: '添加错误'
      }
    }
  }

  // 修改文档
  async updateDocument (ctx) {
    const session = await mongoose.startSession()
    session.startTransaction()
    const { body } = ctx.request
    try {
      const md = await Document.findOneAndUpdate(
        { _id: body.id },
        { $set: { title: body.title, content: body.content } }, { new: true })
      if (typeof body.directoryId !== 'undefined' && body.directoryId !== '') {
        await DirectoryItem.updateOne({
          directoryId: body.directoryId
        }, {
          $push: {
            directory_item: {
              $each: [{
                id: md._id,
                name: md.title
              }],
              $position: 0
            }
          }
        })
      } else {
        await Directory.updateOne({
          projectId: body.projectId
        }, {
          $push: {
            directory: {
              $each: [{
                id: md._id,
                name: md.title,
                page: true
              }],
              $position: 0
            }
          }
        })
      }
      ctx.body = {
        code: 200,
        msg: '修改成功'
      }
      await session.commitTransaction()
      session.endSession()
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      ctx.body = {
        code: 500,
        msg: '修改错误'
      }
    }
  }

  // 删除文档
  async deleteDocument (ctx) {
    const session = await mongoose.startSession()
    session.startTransaction()
    const { body } = ctx.request
    try {
      //  事务 - 数据一致性
      await Document.deleteOne({ _id: body.id })
      if (typeof body.directoryId !== 'undefined' && body.directoryId !== '') {
        await DirectoryItem.updateOne({
          directoryId: body.directoryId
        }, {
          $pull: {
            directory_item: { id: body.id }
          }
        })
      } else {
        await Directory.updateOne({ projectId: body.projectId }, {
          $pull: {
            directory: {
              id: body.id
            }
          }
        }, {
          multi: true
        })
      }
      ctx.body = {
        code: 200,
        msg: '删除成功'
      }
      await session.commitTransaction()
      session.endSession()
    } catch (err) {
      await session.abortTransaction()
      session.endSession()
      ctx.body = {
        code: 500,
        msg: '删除错误'
      }
    }
  }

  // 查看文档
  async getDocument (ctx) {
    const { id } = ctx.query
    const result = await Document.findOne({ _id: id })
    ctx.body = {
      code: 200,
      msg: '查询成功',
      data: result
    }
  }
}

export default new DocumentController()
