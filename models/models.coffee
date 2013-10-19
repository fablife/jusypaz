mongoose  = require('mongoose')


Schema    = mongoose.Schema

UserSchema = new Schema({
  username: { type: String, required : true, index: { unique: true }},
  password: { type: String, required : true},
  name : { type: String },
  role: { type: String }
})

exports.User = mongoose.model('User', UserSchema)
