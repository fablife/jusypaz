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
    ciudad      : { type: String }
})

HojaSchema = new Schema({
   cedula:          { type: String, required: true},
   estado_civil:    { type: String },
   alias:           { type: String },
   lugar_cedula:    { type: String },
   lugar_nacimiento5: { type: String },
   frente_bec:      { type: String },
   num_desmovil:    { type: String },
   licencia_cond:   { type: String },
   pasaporte:       { type: String },
   salud:           { type: String },
   clinica:         { type: String },
   otros_nombres:   { type: String },
   estatura:        { type: String },
   peso:            { type: String },
   domicilio:       { type: String },
   residencia:      { type: String },
   fijo:            { type: String },
   celular:         { type: String },
   profesion:       { type: String },
   militar:         { type: String },
   grado:           { type: String },
   conyugue:        { type: String },
   madre:           { type: String },
   padre:           { type: String },
   hijos:           { type: String },
   hermanos:        { type: String },
   cuentas_ahorro:  { type: String },
   cuentas_corriente: { type: String },
   tarjetas_credito:  { type: String },
   cdt:             { type: String },
   obligaciones_entidades:  { type: String },
   obligaciones_familiares: { type: String },
   seguros_vida:    { type: String },
   inmuebles:       { type: String },
   muebles:         { type: String },
   sociedades:      { type: String },
   otros:           { type: String },
   bienes_fondo:    { type: String }
})
 


exports.User = mongoose.model('User', UserSchema)
exports.Postulado = mongoose.model('Postulado', PostuladoSchema)
exports.Hoja = mongoose.model('Hoja', HojaSchema)
