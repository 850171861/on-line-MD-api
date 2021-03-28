import Directory from '../model/Directory'

class DirectoryController {
  // 创建项目目录
  async createDirectory(ctx){
     const { body } = ctx.request

     const DirectoryData = new Directory({
       projectId:'6060509a5610b764a4bc1eb3',
       directory:[
         {name1:'page1',id:'111111111111'},
         {name2:'page2',children:[{name22:"name22"}]}
       ]
     })
     await DirectoryData.save()
     ctx.body = {
       code:200,
       msg:'添加成功'
     }
  }
  // 查询目录
  async getDirectory(ctx){
    const { projectId } = ctx.request.body
    const result = await Directory.findOne({ projectId })
    ctx.body = {
      code:200,
      msg:'查询成功',
      data:result
    }
  }
  // 修改目录
  async updateDirectory(ctx){
    const { body } = ctx.request
//     const result = await Directory.update(
//     {projectId: body.projectId, 'directory.id': '123'}, 
//     {$set: {
//         'directory.$.name1':"name1"     
//     }}
// );
 const result = await Directory.update(
    {projectId: body.projectId, 'directory.children.id': '123'}, 
    {$set: {
        'directory.children.name':"修改"     
    }}
);
ctx.body = {
  code:200,
  msg:'修改成功',
  data:result
}
  }
}

export default new DirectoryController