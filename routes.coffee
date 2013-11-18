Postulado = require('./models/models').Postulado
Usuario = require('./models/models').User
Hoja = require("./models/models").Hoja
Delito = require("./models/models").Delito

exports.index = (req,res) ->
  res.render('index')

exports.tablero = (req,res) ->
  res.render('tablero',{role: req.user.role})

exports.admin = (req,res) ->
  res.render('admin/index')

exports.save_user = (req,res) ->
    console.log ("save_user")
    console.log (req.body)
    u = new Usuario(req.body)
    u.save((err) -> 
      if err?
        handle_error(err,"Error creando nuevo usuario!",res)
      else
        console.log("Usuario " + u.username + " salvado.")
        res.send("Usuario salvado")
    )

exports.save_postulado = (req,res) ->
    console.log ("save_postulado")
    console.log (req.body)
    p = new Postulado(req.body)
    p.save((err) -> 
      if err?
       handle_error(err,"Error creando nuevo postulado!",res)
      else
       console.log("Postulado " + p.nombres + " " + p.apellidos + " salvado.")
       res.send("Postulado salvado")
    )

exports.usuarios = (req, res) ->
  console.log("GET usuarios")
  Usuario.find({}, (err, usuarios) ->
    if err?
      handle_error(err, "Error retornando lista de usuarios", res)
    res.send(usuarios)
  console.log("Lista de usuarios mandada")
  )

exports.postulados = (req, res) ->
  console.log("GET postulados ")
  Postulado.find({}, (err, postulados) ->
    if err?
        handle_error(err, "Error retornando lista de postulados")
    res.send(postulados)
    console.log("Lista de postulados mandada")
    )

exports.postulado = (req, res) ->
  console.log("GET postulado ")
  cedula = req.params.postuladoId
  can_access(req, res, cedula, (err) ->
    if err?
      handle_error(err, err.message, res)
    else
      getPostulado(req, res)
  )

exports.hv = (req, res) ->
  console.log "Hoja de vida"
  cedula = req.params.postuladoId
  console.log "params: " + req.params
  console.log "Cedula: " + cedula
  can_access(req, res, cedula, (err) ->
    if err?
      handle_error(err, err.message, res)
    else
      getHv(req, res)
  )

exports.save_hv = (req, res) ->
  console.log "Salvar hoja de vida"
  cedula = req.params.postuladoId
  console.log "Cedula: " + cedula
  can_access(req, res, cedula, (err) ->
    if err?
      handle_error(err, err.message, res)
    else
      saveHv(req, res)
  )

exports.create_delito = (req, res) ->
  console.log "get empty delito"
  cedula = req.params.postuladoId
  console.log "Cedula: " + cedula
  can_access(req, res, cedula, (err) ->
    if err?
      handle_error(err, err.message, res)
    else
      crea_delito(req, res)
  )

exports.save_delito = (req, res) ->
  console.log "Salvar hoja de vida"
  cedula = req.params.postuladoId
  console.log "Cedula: " + cedula
  can_access(req, res, cedula, (err) ->
    if err?
      handle_error(err, err.message, res)
    else
      save_delito(req, res)
  )

exports.jyp_delitos = (req, res) ->
  console.log "GET informacion de justicia y paz"
  cedula = req.params.postuladoId
  console.log "Cedula: " + cedula
  can_access(req, res, cedula, (err) ->
  if err?
      handle_error(err, err.message, res)
    else
      getDelitos(req, res)
  )

handle_error = (exception, text, res, code=500) ->
    console.log(text)
    console.log exception
    res.statusCode = code
    res.end(text)

can_access = (req, res, cedula, callback) ->
  role = req.user.role
  user_cedula = req.user.cedula
  Postulado.findOne({ cedula:cedula }, (err, user) ->
    if err?
      callback(err)
    if not user?
      text = "No se encontró postulado con esa cédula"
      console.log text
      callback(new Error(text))
    else if not cedula == user_cedula or role is not "admin"
      callback(new Error("No tiene derecho a acceder a ver esta información"))
    else
      console.log "Can access"
      callback(null)
    )

getPostulado = (req, res) ->
  console.log("_get postulado")
  p = req.params.postuladoId
  if not p?
    handle_error( new Error("Error accedendo a postulado."), "Postulado con cedula " + p " no encontrado", res)
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado.")
    res.send(postulado)
    console.log("Postulado retornado")
    )


getHv = (req, res) ->
  console.log("_get hoja de vida")
  p = req.params.postuladoId
  if not p?
    handle_error(new Error(), "Error accedendo a postulado.", res)  
  Hoja.find({'cedula':p}, (err, hv_postulado) ->
    if err?
      handle_error(err, "Error accedendo a postulado.", res)
    res.send(hv_postulado)
    console.log("Hoja de vida de postulado retornada")
    )

saveHv = (req, res) ->
  console.log("_salvando hoja de vida...")
  p = req.params.postuladoId
  Hoja.update('cedula': p, req.body , {upsert: true}, (err) ->
    if err?
      handle_error(err, "Error salvando hoja de vida.", res)
    res.send("HV saved ok")
    console.log("Hoja de vida salvada con exito");
  )

getDelitos = (req, res) ->
  console.log("_get informacion justicia y paz")
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)  
  Delito.find({'cedula':p}, (err, hechos_postulado) ->
    if err?
      handle_error(err, "Error accedendo a postulado.", res)
    res.send(hechos_postulado)
    console.log("Hechos de postulado retornados")
    )

save_delito = (req, res) ->
  console.log("_save_delito")
  p = req.params.postuladoId

  Delito.update('cedula':p, req.body , {upsert: true}, (err) ->
    if err?
      handle_error(err, "Error salvando delito.", res)
    res.send("Delito salvado ok")
    console.log("Delito salvado con exito");
  )

crea_delito = (req, res) ->
  console.log("_crea_delito")
  console.log(req.body)
  p = req.params.postuladoId
  d = new Delito()
  for p in d
    if (typeof p == "string")
      p = "No especificado"
  d.titulo = req.body.titulo
  d.cedula = p
  d.save((err) ->
    if err?
      handle_error(err, "Error en get_empty_delito", res)
    res.send(d)  
    console.log("Nuevo delito creado y retornado")
  )