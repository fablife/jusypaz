mongoose  = require('mongoose')


Schema    = mongoose.Schema

UserSchema = new Schema({
  username: { type: String },
  cedula:   { type: String, required: true, index: { unique: true }},
  password: { type: String, required : true},
  name : { type: String },
  role: { type: String }
})

CodigoPenalSchema = new Schema({
  nombre: { type: String, required: true, index: { unique: true }}
})

PostuladoSchema = new Schema({
    nombres:    { type: String, required: true},
    apellidos:  { type: String, required: true},
    cedula:     { type: String, required: true, index: { unique: true }},
    fecha_nacimiento: {type: Date },
    ciudad      : { type: String },
    picture     : { type: String, default: ""}
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
  tipo_version:   { type: String, default: "No especificado"},
  fecha_version:  { type: String, default: "No especificado"},
  codigo_penal:   { type: String, default: "No especificado" },
  fiscalia:       { type: String, default: "No especificado" },
  sitio_reclusion:{ type: String, default: "No especificado" },
  bloque_post:    { type: String, default: "No especificado" },
  hora_mencion:   { type: String, default: "No especificado" },
  responsabilidad:{ type: Boolean, default: false },
  confesado:      { type: Boolean, default: false },
  narracion:      { type: String, default: "No especificado" },
  clasificacion:  { type: String, default: "No especificado" },
  fecha_ocurrencia: { type: Date },
  pais:           { type: String, default: "No especificado" },
  dept:           { type: String, default: "No especificado" },
  municipio:      { type: String, default: "No especificado" },
  corregimiento:  { type: String, default: "No especificado" },
  vereda:         { type: String, default: "No especificado" },
  finca:          { type: String, default: "No especificado" },
  via:            { type: String, default: "No especificado" },
  direccion:      { type: String, default: "No especificado" },
  otro_lugar:     { type: String, default: "No especificado" },
  video_path:     { type: String },
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
   lugar_nacimiento: { type: String },
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

FosaSchema = new Schema({
  enunciada:        { type: Boolean, default: false },
  titulo:           { type: String, required: true},
  cedula:           { type: String, required: true},
  delito:           { type: String },
  delito_id:        { type: String },
  postulado_nombre: { type: String },
  hora_mencion:     { type: String, default: "No especificado"  },
  victima_nombre:   { type: String, default: "No especificado" },
  perfil_victima:   { type: String, default: "No especificado" },
  pais:             { type: String, default: "Colombia" },
  departamento:     { type: String, default: "Antioquia" },
  municipio:        { type: String, default: "No especificado" },
  corregimiento:    { type: String, default: "No especificado" },
  vereda:           { type: String, default: "No especificado" },
  lat:              { type: Number, default: 0 },
  long:             { type: Number, default: 0 },
  id_victima:       { type: String, default: "No especificado" },
  entregada_familia:{ type: String, default: "No especificado" }
})

BienSchema = new Schema({
  cedula:           { type: String, required: true},
  titulo:           { type: String, required: true}, 
  delito:           { type: String },
  delito_id:        { type: String },
  postulado_nombre: { type: String },
  datos_version:    { type: String, default: "No especificado" },
  perfil:           { type: String, default: "No especificado" },
  documentos:       { type: String, default: "No especificado" },
  lat:              { type: Number, default: 0 },
  long:             { type: Number, default: 0 },
})

MenorSchema = new Schema({
  status:           { type: String, default: "No especificado" },
  nombres:          { type: String, default: "No especificado" },
  apellidos:        { type: String, default: "No especificado" },
  cedula:           { type: String, required: true },
  cedula_menor:     { type: String, required: true },
  alias:            { type: String, default: "No especificado" },
  fecha_ingreso:    { type: Date },
  edad_ingreso:     { type: String, default: "No especificado" },
  edad_desmovilizado:{ type: String, default: "No especificado" }
  frente:           { type: String, default: "No especificado" },
  comandante:       { type: String, default: "No especificado" },
  labor:            { type: String, default: "No especificado" },
  nivel_academico:  { type: String, default: "No especificado" },
  acudiente:        { type: String, default: "No especificado" },
  direccion:        { type: String, default: "No especificado" },
  telefono:         { type: String, default: "No especificado" },
  incapacidades:    { type: String, default: "No especificado" }
})

ProcesoSchema = new Schema({
  tipo:             { type: String, default: "No especificado" },
  cedula:           { type: String, required: true},
  titulo:           { type: String, required: true}, 
  imputaciones:     { type: String, default: "No especificado" },
  condenas:         { type: String, default: "No especificado" },
  absoluciones:     { type: String, default: "No especificado" },
  investigaciones:  { type: String, default: "No especificado" }
})

ParapoliticaSchema = new Schema({
  tipo:             { type: String, default: "No especificado" },
  cedula:           { type: String, required: true },
  nombres_implicado:    { type: String, default: "No especificado" },
  apellidos_implicado:  { type: String, default: "No especificado" },
  titulo:           { type: String, required: true},
  compulsa_copias:  { type: String, default: "No especificado" },
  condenas:         { type: String, default: "No especificado" },
  absolucion:       { type: String, default: "No especificado" },
  narracion:        { type: String, default: "No especificado" },
  pais:             { type: String, default: "Colombia" },
  departamento:     { type: String, default: "Antioquia" },
  municipio:        { type: String, default: "No especificado" },
  corregimiento:    { type: String, default: "No especificado" },
  vereda:           { type: String, default: "No especificado" },
  lat:              { type: Number, default: 0 },
  long:             { type: Number, default: 0 },
})

RelacionesAutoridadesSchema = new Schema({
  tipo:             { type: String, default: "No especificado" },
  cedula:           { type: String, required: true },
  nombres_implicado:    { type: String, default: "No especificado" },
  apellidos_implicado:  { type: String, default: "No especificado" },
  titulo:           { type: String, required: true},
  compulsa_copias:  { type: String, default: "No especificado" },
  condenas:         { type: String, default: "No especificado" },
  absolucion:       { type: String, default: "No especificado" },
  narracion:        { type: String, default: "No especificado" },
  rango:            { type: String, default: "No especificado" },
  dependencia:      { type: String, default: "No especificado" },
  fecha:            { type: Date },
  pais:             { type: String, default: "Colombia" },
  departamento:     { type: String, default: "Antioquia" },
  municipio:        { type: String, default: "No especificado" },
  corregimiento:    { type: String, default: "No especificado" },
  vereda:           { type: String, default: "No especificado" },
  lat:              { type: Number, default: 0 },
  long:             { type: Number, default: 0 },
})

OperacionesConjuntasSchema = new Schema({
  tipo:             { type: String, default: "No especificado" },
  cedula:           { type: String, required: true },
  nombres_implicado:    { type: String, default: "No especificado" },
  apellidos_implicado:  { type: String, default: "No especificado" },
  titulo:           { type: String, required: true},
})
 
exports.User        = mongoose.model('User', UserSchema)
exports.Postulado   = mongoose.model('Postulado', PostuladoSchema)
exports.Hoja        = mongoose.model('Hoja', HojaSchema)
exports.Delito      = mongoose.model('Delito', DelitoSchema)
exports.Participante= mongoose.model('Participante', ParticipanteSchema)
exports.Victima     = mongoose.model('Victima', VictimaSchema)
exports.CodigoPenal = mongoose.model('CodigoPenal', CodigoPenalSchema)
exports.Fosa        = mongoose.model('Fosa', FosaSchema)
exports.Bien        = mongoose.model('Bien', BienSchema)
exports.Menor       = mongoose.model('Menor', MenorSchema)
exports.Proceso     = mongoose.model('Proceso', ProcesoSchema)
exports.Parapolitica= mongoose.model('Parapolitica', ParapoliticaSchema)
exports.RelacionesAutoridades= mongoose.model('RelacionesAutoridades', RelacionesAutoridadesSchema)
exports.OperacionesConjuntas= mongoose.model('OperacionesConjuntas', OperacionesConjuntasSchema)
