import mongoose from '../config/dbConfig'

const Schema = mongoose.Schema

const DirectoryItemSchema = new Schema({
  created: { type: Date },
  directory_item: { type: Array },
  directoryId: { type: String }
})

DirectoryItemSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

const DirectoryItemModel = mongoose.model('directory_item', DirectoryItemSchema)

export default DirectoryItemModel
