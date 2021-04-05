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
      if (body.directoryId !== '') {
         let isDirectoryItem = await DirectoryItem.findOne({directoryId: body.directoryId})
         if(isDirectoryItem !== null){
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
         }else{
           let data = new DirectoryItem({directoryId: body.directoryId,directory_item:[{
                   id: mongoose.Types.ObjectId(md._id).toString(),
                   name: md.title
                 }]})
           data.save()
         }
      } else {
            let data = new Directory({projectId: body.projectId,
            page: true,
            directory:[{
                   id: mongoose.Types.ObjectId(md._id).toString(),
                   name: md.title
                 }]})
           data.save()
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
      if (body.directoryId !== '') {
         await Directory.deleteOne({projectId: body.projectId,'directory.id': body.id})
        const isDirectoryItem = await DirectoryItem.findOne({directoryId: body.directoryId,'directory_item.id': body.id})
        if(isDirectoryItem !== null){
         await DirectoryItem.updateOne({
          directoryId: body.directoryId,'directory_item.id': body.id
        }, {
          $set: {
            'directory_item.$.name': md.title
          }
        })
        }else{

           // 删除
       const a =  await DirectoryItem.update({}, {
          $pull: {
            directory_item: {
              id:mongoose.Types.ObjectId(md._id).toString()
            }
          }
        }, {
        multi: true
      })
      const isDirectoryItem = await DirectoryItem.findOne({directoryId: body.directoryId})
      if(isDirectoryItem !== null){
      // 修改
          await DirectoryItem.updateOne({
          directoryId: body.directoryId
        }, {
          $push: {
            directory_item: {
              $each: [{
                id:mongoose.Types.ObjectId(md._id).toString(),
                name: md.title
              }],
              $position: 0
            }
          }
        })
      }else{
        let data = new DirectoryItem({
          directoryId: body.directoryId,
          directory_item:[{
                id: mongoose.Types.ObjectId(md._id).toString(),
                name: md.title
              }]
        })
       data.save()
      }
        }
      } else {
        
           // 删除
        await DirectoryItem.update({}, {
          $pull: {
            directory_item: {
              id:mongoose.Types.ObjectId(md._id).toString()
            }
          }
        }, {
        multi: true
      })

        let data = new Directory({
          projectId: body.projectId,
          page:true,
          directory:[{
            id:mongoose.Types.ObjectId(md._id).toString(),
            name: md.title
          }]
        })

        data.save()
        
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
      if (body.directoryId !== '') {
        await DirectoryItem.update({
          directoryId: body.directoryId
        }, {
          $pull: {
            directory_item: { id: body.id }
          }
        })
      } else {
      await Directory.deleteOne({projectId: body.projectId,'directory.id': body.id})
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
