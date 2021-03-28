import mongoose from '../config/dbConfig'

const Schema = mongoose.Schema

const DirectorySchema = new Schema({
   created:{ type: Date },
   directory:{ type: Array },
   projectId:{ type: String }
})

DirectorySchema.pre('save',function(next){
  this.created = new Date()
  next()
})

const DirectoryModel = mongoose.model('directory',DirectorySchema)

export default DirectoryModel