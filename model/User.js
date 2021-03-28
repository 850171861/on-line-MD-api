import mongoose from '../config/dbConfig'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
   created:{
    type: Date 
  }
})

UserSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

const UserModel = mongoose.model('user', UserSchema)

export default UserModel
