Postulado = require('./models/models').Postulado
Usuario = require('./models/models').User

exports.index = (req,res) ->
  res.render('index')

exports.tablero = (req,res) ->
  res.render('tablero',{role: req.user.role})

exports.admin = (req,res) ->
  res.render('admin/index')

exports.save_postulado = (req,res) ->
    console.log (req.body)
    try
      p = new Postulado(req.body)
      p.save((err) -> 
        if err?
          throw err
        else
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

exports.hechos = (req, res) ->
  console.log("hechos")
  cedula = req.params.cedula
  can_access(req,res,cedula, (err) ->
        if err?
          handle_error(err,err.message,res)
        else
          console.log "going to render"
          res.render('hechos')
        )
        #Hecho.find({'cedula':cedula}, (err, hechos) {
        #  res.render('hechos',{hechos: hechos})
        #  console.log("Lista de hechos mandada")
        #  })
exports.hv = (req, res) ->
  console.log "Hoja de vida"
  cedula = req.params.postuladoId
  console.log "params: " + req.params
  console.log "Cedula: " + cedula
  can_access(req, res, cedula, (err) ->
    if err?
      handle_error(err, err.message, res)
    else
      getPostulado(req, res)
  )
exports.consulta_cedula = (req,res) ->
  console.log "Consulta cedula"
  cedula = req.body.cedula
  console.log cedula
  role = req.user.role
  console.log role
  can_access(req,res,cedula, (err) ->
      if err?
        handle_error(err,err.message,res)
      else
        res.redirect('/hechos/'+cedula)
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