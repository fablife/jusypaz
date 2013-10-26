mongoose  = require('mongoose')


Schema    = mongoose.Schema

UserSchema = new Schema({
  username: { type: String, required : true, index: { unique: true }},
  cedula:   { type: String, required: true},
  password: { type: String, required : true},
  name : { type: String },
  role: { type: String }
})

PostuladoSchema = new Schema({
    nombres:    { type: String, required: true},
    apellidos:  { type: String, required: true},
    cedula:     { type: String, required: true},
    fecha_nacimiento: {type: Date },
    estado_civil: { type: String },
    direccion   : { type: String },
    ciudad      : { type: String },
    telefono_fijo: { type: String },
    telefono_movil: { type: String },
    correo_electronico: { type: String },
    estudios    : { type: String },
    experiencia : { type: String }
})


exports.User = mongoose.model('User', UserSchema)
exports.Postulado = mongoose.model('Postulado', PostuladoSchema)
