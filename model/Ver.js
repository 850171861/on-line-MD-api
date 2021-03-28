import mongoose from '../config/dbConfig'
const Schema = mongoose.Schema

const VerSchema = new Schema({
  username: {
    type: String
  },
  ver: {
    type: String
  },
  created:{
    type: Date 
  }
  
})

VerSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

const VerModel = mongoose.model('Ver', VerSchema)

export default VerModel
