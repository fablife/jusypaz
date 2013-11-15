Postulado = require('./models/models').Postulado
Usuario = require('./models/models').User
Hoja = require("./models/models").Hoja

exports.index = (req,res) ->
  res.render('index')

exports.tablero = (req,res) ->
  res.render('tablero',{role: req.user.role})

exports.admin = (req,res) ->
  res.render('admin/index')

exports.save_user = (req,res) ->
    console.log ("save_user")
    console.log (req.body)
    try
      u = new Usuario(req.body)
      u.save((err) -> 
        if err?
          throw err
        else
          console.log("Usuario " + u.username + " salvado.")
          res.send("Usuario salvado")
      )
    catch e
      handle_error(e,"Error creando nuevo usuario!",res)

exports.save_postulado = (req,res) ->
    console.log ("save_postulado")
    console.log (req.body)
    try
      p = new Postulado(req.body)
      p.save((err) -> 
        if err?
          throw err
        else
          console.log("Postulado " + p.nombres + " " + p.apellidos + " salvado.")
          res.send("Postulado salvado")
      )
    catch e
      handle_error(e,"Error creando nuevo postulado!",res)

exports.usuarios = (req, res) ->
  console.log("GET usuarios")
  try
    Usuario.find({}, (err, usuarios) ->
      if err?
        throw err
      res.send(usuarios)
      console.log("Lista de usuarios mandada")
      )
  catch e
    handle_error(e, "Error retornando lista de usuarios", res)

    
exports.postulados = (req, res) ->
  console.log("GET postulados ")
  try
    Postulado.find({}, (err, postulados) ->
      if err?
        throw err
      res.send(postulados)
      console.log("Lista de postulados mandada")
      )
  catch e
    handle_error(e, "Error retornando lista de postulados")



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
  try
    p = req.params.postuladoId
    if not p?
      throw new Error("Postulado invalido")
    Postulado.find({'cedula':p}, (err, postulado) ->
      if err?
        throw err
      res.send(postulado)
      console.log("Postulado retornado")
      )
  catch error
      handle_error(error, "Error accedendo a postulado.")


getHv = (req, res) ->
  console.log("_get hoja de vida")
  try
    p = req.params.postuladoId
    if not p?
      throw new Error("Postulado invalido")
    return_obj = {}
    Hoja.find({'cedula':p}, (err, hv_postulado) ->
      if err?
        throw err      
      res.send(hv_postulado)
      console.log("Hoja de vida de postulado retornada")
      )
  catch error
      handle_error(error, "Error accedendo a postulado.", res)

saveHv = (req, res) ->
  console.log("_salvando hoja de vida...")
  try
    p = req.params.postuladoId
    Hoja.update('cedula': p, req.body , {upsert: true}, (err) ->
      if err?
        throw err
      res.send("HV saved ok")
      console.log("Hoja de vida salvada con exito");
      )
  catch e
    handle_error(e, "Error salvando hoja de vida.", res)
    # ...
  