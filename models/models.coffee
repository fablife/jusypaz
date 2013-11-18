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

ParticipanteSchema = new Schema({
    nombres:      { type: String, required: true},
    apellidos:    { type: String, required: true},
    alias:        { type: String },
    pertenencia:  { type: String },
    confesado:    { type: Boolean }, 
    hora_mencion: { type: String },
    otros_implicados: { type: Array },
    participacion: { type: String }
})

VictimaSchema = new Schema({
    nombres:      { type: String, required: true},
    apellidos:    { type: String, required: true},
    perfil:       { type: String },
    oficio:       { type: String },
    enunciada_por:{ type: String },
    datos_completos: { type: String }
})

DelitoSchema = new Schema({
  cedula:         { type: String, required: true},  
  titulo:         { type: String, required: true},
  tipo_version:   { type: String},
  fecha_version:  { type: String},
  codigo_penal:   { type: String },
  fiscalia:       { type: String },
  sitio_reclusion:{ type: String },
  bloque_post:    { type: String },
  hora_mencion:   { type: String },
  responsabilidad:{ type: Boolean },
  confesado:      { type: Boolean },
  narracion:      { type: String },
  clasificacion:  { type: String },
  fecha_ocurrencia: { type: Date },
  pais:           { type: String },
  dept:           { type: String },
  municipio:      { type: String },
  corregimiento:  { type: String },
  vereda:         { type: String },
  finca:          { type: String },
  via:            { type: String },
  direccion:      { type: String },
  otro_lugar:     { type: String },
  lat:            { type: Number },
  long:           { type: Number },
  participantes:  { type: Array },
  victimas:       { type: Array }
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
 
exports.User        = mongoose.model('User', UserSchema)
exports.Postulado   = mongoose.model('Postulado', PostuladoSchema)
exports.Hoja        = mongoose.model('Hoja', HojaSchema)
exports.Delito       = mongoose.model('Delito', DelitoSchema)
exports.Participante= mongoose.model('Participante', ParticipanteSchema)
exports.Victima     = mongoose.model('Victima', VictimaSchema)
