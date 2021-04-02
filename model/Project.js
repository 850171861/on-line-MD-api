import mongoose from '../config/dbConfig'
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
  uuid: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  publics: {
    type: Boolean
  },
  password: {
    type: String
  },
  uid: {
    type: String, ref: 'user'
  },
  roles: { type: Array }, // create-创建者,read-只读 read-write - 读写
  created: {
    type: Date
  }
})

ProjectSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

const ProjectModel = mongoose.model('project', ProjectSchema)

export default ProjectModel
