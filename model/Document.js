import mongoose from '../config/dbConfig'

const Schema = mongoose.Schema

const DocumentSchema = new Schema({
  created: { type: Date },
  title: { type: String },
  content: { type: String }

})

DocumentSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

const DocumentModel = mongoose.model('document', DocumentSchema)

export default DocumentModel
