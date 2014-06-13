########################################
## ROUTES
########################################
Postulado   = require('./models/models').Postulado
Usuario     = require('./models/models').User
Hoja        = require("./models/models").Hoja
Delito      = require("./models/models").Delito
Fosa        = require("./models/models").Fosa
Bien        = require("./models/models").Bien
Menor       = require("./models/models").Menor
Proceso     = require("./models/models").Proceso
Message     = require("./models/models").Message
Parapolitica= require("./models/models").Parapolitica
RelacionesAutoridades = require("./models/models").RelacionesAutoridades
OperacionesConjuntas = require("./models/models").OperacionesConjuntas

CodigoPenal = require("./models/models").CodigoPenal

handle_error = require("./utils").handle_error
convert_date = require("./utils").convert_date
logger       = require("./logger")

fs = require('fs')
multiparty = require('multiparty')

exports.ping = (req, res) ->
  res.send("OK", 204)

exports.index = (req,res) ->
  res.render('index', {message: req.flash('loginerror')})

exports.logout = (req, res) ->
  req.logout()
  res.redirect('/')

exports.tablero = (req,res) ->
  res.render('tablero', {role: req.user.role})

exports.inicio = (req,res) ->
  res.render('inicio',{role: req.user.role})

exports.admin = (req,res) ->
  res.render('admin/index')

exports.new_codigo = (req, res) ->
  logger.debug("new codigo")

  if req.method isnt "POST"
    handle_error(new Error(), "Invalid access", res)
  else
    codigo = req.body.codigo
    logger.debug( req.body)
    
    if codigo?
      cp = new CodigoPenal()
      cp.nombre = codigo
      cp.save((err) ->
        if err?
          handle_error(err, "Error grabando el nuevo codigo penal.", res)
        else
          logger.info( "Nuevo código grabado con éxito")
          res.send(cp)
      )
    else 
      handle_error(new Error(), "Informacion enviada invalida.", res)


exports.messages = (req, res) ->
  logger.debug("messages")

  Message.find({'read': false}, (err, messages) ->
    if err?
      handle_error(err, "Error chequeando los mensajes!", res)
    else
      logger.info("Mensajes leidos")
      res.send(messages)
  )

exports.msg_read = (req, res) ->
  logger.debug("msg read")

  if req.method isnt "POST"
    handle_error(new Error(), "Invalid access", res)
  else  
    id = req.params.msgId
    logger.debug( id )
    logger.debug( req.params )

    if id?
      Message.findById(id, (err, message) ->
        if err?
          handle_error(err, "Error marcando mensaje leido!", res)
        else
          message.read = true;
          message.save((err) ->
            logger.info("Mensaje marcado leidos")
            res.send("OK")
          )      
      )
    else
      handle_error(new Error(), "Invalid message id", res)

exports.msg_delete = (req, res) ->
  logger.debug("msg delete")

  id = req.params.msgId
  if id?
    Message.findById(id, (err, msg) ->
      if err?
        handle_error(err, "Error eliminando mensaje!", res)
      else
        msg.remove((err) ->
          logger.info "Mensaje eliminado con éxito"
          res.send("OK")
        )
    )
  else
    handle_error(new Error(), "Invalid message id", res)

exports.get_messages = (req, res) ->
  logger.debug("messages")

  Message.find((err, messages) ->
    if err?
      handle_error(err, "Error chequeando los mensajes!", res)
    else
      logger.info("Mensajes leidos")
      res.send(messages)
  )

exports.pwd = (req, res) ->
  logger.debug("change pwd")

  if req.method isnt "POST"
    handle_error(new Error(), "Metodo ilegal de acceso", res)
  else
    form = req.body
    Usuario.findById(req.user._id, (err, user) ->
      if err?
        handle_error(err, "Error accedendo al usuario al cambiar contraseña.", res)
      else
        if (user.password isnt form.current)
          handle_error(new Error(), "La contraseña actual no es correcta!", res)
        else if (form.new_pass.length < 6 or form.new_pass_confirm < 6) 
          handle_error(new Error(), "La nueva contraseña tiene mínimo 6 caractéres!", res)
        else if (form.new_pass isnt form.new_pass_confirm) 
          handle_error(new Error(), "La nueva contraseña y su confirmación no coinciden!", res)
        else
          user.password = form.new_pass;
          user.save((err) ->
            if err?
              handle_error(err, "No se pudo grabar la nueva contraseña!", res)
            else
              logger.info "Nueva contraseña grabada con éxito"
              res.send("OK")
          )
    )

exports.send_message = (req, res) ->
  logger.debug "send message"

  if req.method isnt "POST"
    handle_error(new Error(), "Metodo ilegal de acceso", res)
  else
    form = req.body
    Postulado.findOne({'cedula': req.user.cedula}, (err, user) ->
      if err?
        handle_error(err, "Error accedendo al usuario para guardar mensaje.", res)
      else
        msg = new Message();
        msg.sender = user.nombres + " " + user.apellidos
        msg.sender_id = user._id
        msg.subject = form.subject
        msg.message = form.message
        msg.date = Date.now()
        msg.save((err) -> 
          if err?
            handle_error(err, "No se pudo grabar el mensaje mandado.", res)
          else
            logger.info "Nuevo mensaje guardado en el sistema con éxito"
            res.send "OK"
        )
    )

exports.informe_postulado = (req, res) ->
  cedula = req.params.postuladoId
  data_objects = [Fosa, Bien, Menor, Delito, Proceso, RelacionesAutoridades, OperacionesConjuntas, Parapolitica]
  _get_all_postulado_data(cedula,data_objects, res)

exports.informe = (req, res) ->
  data_objects = [Fosa, Bien, Menor, Delito, Proceso, RelacionesAutoridades, OperacionesConjuntas, Parapolitica]
  _get_all_data(data_objects, res)

exports.update_codigo = (req, res) ->
  logger.debug("update_codigo")
  c = {}
  try
    c = new CodigoPenal(req.body)
  catch e
    handle_error(e, "Seems no valid data in update_codigo update request", res)
    return
  upsert_data = c.toObject()
  delete upsert_data._id
  
  CodigoPenal.update({_id: c.id}, upsert_data, {upsert: true}, (err) ->
    if err?
      handle_error(err, "Error grabando update para codigo penal", res)
    else
      logger.info("Codigo Penal " + c.nombre + " grabado")
      res.send(c)
  )
  
exports.save_user = (req,res) ->
    logger.debug ("save_user")
    logger.debug (req.body)
    u = {}
    try
      u = new Usuario(req.body)
    catch e
      handle_error(e, "Seems no valid data in save_user save request!", res)
      return
    upsert_data = u.toObject()
    delete upsert_data._id

    Usuario.update({_id: u.id}, upsert_data, {upsert: true}, (err) ->
      if err?
        handle_error(err,"Error creando nuevo usuario!",res)
      else
        logger.info("Usuario " + u.username + " grabado.")
        res.send("Usuario grabado")
    )

exports.save_postulado = (req,res) ->
    logger.debug ("save_postulado")
    logger.debug (req.body)
    obj = req.body
    if not (/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(obj.fecha_nacimiento))
      handle_error(new Error(), "Formato fecha invalido!", res)
    else
      obj.fecha_nacimiento = convert_date(obj.fecha_nacimiento)
      p = {}
      try
        p = new Postulado(obj)
      catch e
        handle_error(e, "Seems no valid data in save_postulado save request!", res)
        return
      
      upsert_data = p.toObject()
      delete upsert_data._id

      Postulado.update({_id: p.id}, upsert_data, {upsert: true}, (err, num_affected, details) ->
        if err?
          handle_error(err,"Error creando nuevo postulado!",res)
        else
          logger.info("Postulado " + p.nombres + " " + p.apellidos + " grabado.")
          if not details.updatedExisting
            u = new Usuario()
            u.username = p.nombres.substring(0,4) + p.apellidos.substring(0,4) + (""+ (Math.random())).substring(2,6)
            u.cedula = p.cedula
            u.password = "12cambialo34"
            u.role = "usuario"
            u.save((err) ->
            if err?
              handle_error(err, "Se creó el postulado pero no el usuario", res)
            else
              logger.info("Objeto usuario con contraseña estandar para postulado " + p.nombres + " " + p.apellidos + " creado.")
              res.send("Postulado grabado")
            )
          else
            res.send("Postulado grabado")         
      )

exports.delete_user = (req,res) ->
  logger.debug "Delete user"
  id = req.params.userId
  if id is String(req.user._id)
    handle_error(new Error("No puedo eliminar el usuario actual! " + id), "No puedo eliminar el usuario actual!", res)
    logger.info "delete aborted"
    return
    
  Usuario.findById(id, (err, usuario) ->
    cedula = usuario.cedula
    if err?
      handle_error(err, "Error eliminado usuario: Usuario con esa id no existe. Id: " + id)
    else
      Postulado.findOne({'cedula': cedula}, (err, postulado) ->
        if postulado?
          handle_error(err, "No puede eliminar un usuario con postulado asociado. Si quiere hacerlo, primero elimine el postulado!", res)
          return
        else
          Usuario.count({admin: true}, (err, count) ->
            if err?
              handle_error(err, 'No pude leer numero de administradores...demasiado arriesgado eliminar usuario y entonces no lo hago...', res)
            else
              if count > 1
                  usuario.remove((err) ->
                    if err?
                      handle_error(err, "Error eliminando Usuario con id " + id, res)
                    else
                      res.send("OK")
                      logger.info "Usuario eliminado con éxito"
                  )
              else
                handle_error(new Error("No puedo eliminar este usuario, es el último administrador!"), "No puedo eliminar este usuario, es el último administrador!", res)
          )
      )
  )

exports.delete_codigo = (req, res) ->
  logger.debug "Delete codigo"
  id = req.params.codigoId
  
  CodigoPenal.findById(id, (err, codigo) ->
    if err?
      handle_error(err, "Error eliminado codigo penal: CodigoPenal con esa id no existe. Id: " + id)
    else
      codigo.remove((err) ->
      if err?
        handle_error(err, "Error eliminando codigo con id " + id, res)
      else
        res.send("OK")
        logger.info("CodigoPenal eliminado con éxito.")
      )
  )
    

exports.delete_postulado = (req,res) ->
  logger.debug "Delete postulado"
  id = req.params.postuladoId
  Postulado.findById(id, (err, postulado) ->
    if err?
      handle_error(err, "Error eliminado postulado: Postulado con esa id no existe. Id: " + id)
    else
      cedula = postulado.cedula
      postulado.remove((err) ->
      if err?
        handle_error(err, "Error eliminando postulado con id " + id, res)
      else
        Usuario.remove({'cedula': cedula  }, (err) ->
          if err?
            handle_error(err, "Se eliminó el postulado con cedula: " + cedula + " pero no el usuario asociado!", res)
          else
            res.send("OK")
            logger.info "Postulado y usuario asociado eliminado con éxito"
        )
      )
  )

exports.usuarios = (req, res) ->
  logger.debug("GET usuarios")
  Usuario.find({}, (err, usuarios) ->
    if err?
      handle_error(err, "Error retornando lista de usuarios", res)
    res.send(usuarios)
  logger.info("Lista de usuarios mandada")
  )

exports.postulados = (req, res) ->
  logger.debug("GET postulados ")
  Postulado.find({}, (err, postulados) ->
    if err?
        handle_error(err, "Error retornando lista de postulados")
    res.send(postulados)
    logger.info("Lista de postulados mandada")
  )

exports.postulado = (req, res) ->
  logger.debug("GET postulado ")
  getPostulado(req, res)
 
exports.upload_docs = (req, res) ->
  logger.debug("POST docs_upload")
  docs_upload(req, res)

exports.upload_video = (req, res) ->
  logger.debug("POST video_upload")
  video_upload(req, res)

exports.upload_avatar = (req, res) ->
  logger.debug("POST avatar_upload")
  avatar_upload(req, res)
  
exports.hv = (req, res) ->
  logger.debug "Hoja de vida"
  getHv(req, res)

exports.save_hv = (req, res) ->
  logger.debug "Grabar hoja de vida"
  saveHv(req, res)

exports.msg_hv = (req, res) ->
  h = req.body
  Hoja.findOne({cedula: req.user.cedula}, (err, hoja) ->
    if err?
      handle_error(err, "Hoja de vida para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      hoja.mensaje = h.mensaje
      hoja.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para hoja de vida", res)
        else
          res.send(hoja)
      )
  )
########################################################
## DELITOS 
########################################################
exports.create_delito = (req, res) ->
  logger.debug "get empty delito"
  crea_delito(req, res)

exports.save_delito = (req, res) ->
  logger.debug "Grabar delito"
  _save_delito(req, res)

exports.jyp_delitos = (req, res) ->
  logger.debug "GET informacion de delitos justicia y paz"
  getDelitos(req, res)

exports.del_delito = (req, res) ->
  logger.debug "delete delito"
  p = req.params.postuladoId
  d = req.params.itemId
  Delito.findOne({'cedula':p, _id: d}, (err, delito) ->
    if err?
      handle_error(err, "Error eliminando delito: no encontrado", res)
    else
      if (delito)
        delito.remove((err) ->
          if err?
            handle_error(err, "Error eliminando delito", res)
          else
            logger.info "Delito con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.msg_delito = (req, res) ->
  h = req.body
  id = req.params.delitoId
  Delito.findById(id, (err, delito) ->
    if err?
      handle_error(err, "Delito para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      delito.mensaje = h.mensaje
      delito.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para delito", res)
        else
          res.send(delito)
      )
  )
########################################################
## PROCESOS
########################################################
exports.del_proces = (req, res) ->
  logger.debug "delete proces"
  p = req.params.postuladoId
  d = req.params.itemId
  Proceso.findOne({'cedula':p, _id: d}, (err, proc) ->
    if err?
      handle_error(err, "Error eliminando proceso: no encontrado", res)
    else
      if (proc)
        proc.remove((err) ->
          if err?
            handle_error(err, "Error eliminando proceso", res)
          else
            logger.info "Proceso con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_proces = (req, res) ->
  logger.debug "create proces"
  logger.debug(req.body)
  p = req.params.postuladoId
  m = new Proceso()
  m.titulo = req.body.titulo
  m.cedula = p
  m.save((err) ->
    if err?
      handle_error(err, "Error en create_proces", res)
    else
      res.send(m)
      logger.info("Nuevo proceso creado y retornado")
  )

exports.save_proces = (req, res) ->
  logger.debug "Grabar proces"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(err, "Error accedendo a postulado para grabar proceso: Postulado no encontrado", res)
    else
       #fosa = req.body
       #fosa.postulado_nombre = p.nombres + " " + p.apellidos
       obj = req.body
       #date = obj.fecha_ingreso
       #obj.fecha_ingreso  = convert_date(date)
       Proceso.update({'_id': id }, obj, (err) ->
         if err?
           handle_error(err, "Error grabando menor.", res)
           return
         res.send("proceso grabado ok")
         logger.info("proceso grabado con exito")
       )
  )

exports.proces = (req, res) ->
  logger.debug "GET todos proces"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a procesos."), "Postulado con cedula " + p + " no encontrado." , res)  
    return
  Proceso.find({'cedula':p}, (err, menores) ->
    if err?
      handle_error(err, "Error accedendo a procesos.", res)
    res.send(menores)
    logger.info("procesos de postulado retornadas")
    )


exports.msg_proceso= (req, res) ->
  h = req.body
  id = req.params.procesoId
  Proceso.findById(id, (err, proc) ->
    if err?
      handle_error(err, "Proceso para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      proc.mensaje = h.mensaje
      proc.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para proceso", res)
        else
          res.send(proc)
      )
  )

########################################################
## MENORES
########################################################
exports.del_menor = (req, res) ->
  logger.debug "delete menor"
  p = req.params.postuladoId
  d = req.params.itemId
  Menor.findOne({'cedula':p, _id: d}, (err, m) ->
    if err?
      handle_error(err, "Error eliminando menor: no encontrado", res)
    else
      if (m)
        m.remove((err) ->
          if err?
            handle_error(err, "Error eliminando menor", res)
          else
            logger.info "Menor con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_menor = (req, res) ->
  logger.debug "create menor" 
  logger.debug(req.body)
  p = req.params.postuladoId
  m = new Menor()
  m.nombres = req.body.nombres
  m.cedula = p
  m.save((err) ->
    if err?
      handle_error(err, "Error en create_menor", res)
    else
      res.send(m)
      logger.info("Nuevo menor creado y retornado")
  )

exports.save_menor = (req, res) ->
  logger.debug "Grabar menor"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para grabar menor: Postulado no encontrado")
      return
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    obj = req.body
    date = obj.fecha_ingreso
    if date
      obj.fecha_ingreso  = convert_date(date)
    Menor.update({'_id': id }, obj, (err) ->
      if err?
        handle_error(err, "Error grabando menor.", res)
        return
      res.send("menor grabado ok")
      logger.info("menor grabado con exito")
    )
  )

exports.menores = (req, res) ->
  logger.debug "GET todos menores"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a menores."), "Postulado con cedula " + p + " no encontrado." , res)
  Menor.find({'cedula':p}, (err, menores) ->
    if err?
      handle_error(err, "Error accedendo a menores.", res)
    res.send(menores)
    logger.info("menores de postulado retornadas")
    )

exports.msg_menor = (req, res) ->
  h = req.body
  id = req.params.menorId
  Menor.findById(id, (err, menor) ->
    if err?
      handle_error(err, "Menor para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      menor.mensaje = h.mensaje
      menor.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para menor", res)
        else
          res.send(menor)
      )
  )
########################################################
## BIENES
########################################################
exports.del_bien = (req, res) ->
  logger.debug "delete bien"
  p = req.params.postuladoId
  d = req.params.itemId
  Bien.findOne({'cedula':p, _id: d}, (err, b) ->
    if err?
      handle_error(err, "Error eliminando bien: no encontrado", res)
    else
      if (b)
        b.remove((err) ->
          if err?
            handle_error(err, "Error eliminando bien", res)
          else
            logger.info "Bien con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_bien = (req, res) ->
  logger.debug "create bien"
  logger.debug(req.body)
  p = req.params.postuladoId
  b = new Bien()
  b.titulo = req.body.titulo
  b.cedula = p
  b.save((err) ->
    if err?
      handle_error(err, "Error en create_bien", res)
    else
      res.send(b)
      logger.info("Nuevo bien creado y retornado")
  )

exports.save_bien = (req, res) ->
  logger.debug "Grabar bien"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  obj = req.body
  date = obj.fecha_entrega
  if date
    obj.fecha_entrega = convert_date(obj.fecha_entrega)
  p = {}
  try
    p = new Bien(obj)
  catch e
    handle_error(e, "Seems no valid data in save_postulado save request!", res)
    return
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para grabar bien: Postulado no encontrado")
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    Bien.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error grabando fosa.", res)
        return
      res.send("Bien grabado ok")
      logger.info("Bien grabado con exito")
    )
  )

exports.bienes = (req, res) ->
  logger.debug "GET todos bienes"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a bienes."), "Postulado con cedula " + p + " no encontrado." , res)
  Bien.find({'cedula':p}, (err, bienes) ->
    if err?
      handle_error(err, "Error accedendo a bienes.", res)
    else
      res.send(bienes)
      logger.info("Bienes de postulado retornadas")
    )

exports.msg_bien= (req, res) ->
  h = req.body
  id = req.params.bienId
  Bien.findById(id, (err, bien) ->
    if err?
      handle_error(err, "Bien para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      bien.mensaje = h.mensaje
      bien.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para bien", res)
        else
          res.send(bien)
      )
  )

########################################################
## OPERACIONES CONJUNTAS
########################################################
exports.del_op_conjunta = (req, res) ->
  logger.debug "delete op_conjunta"
  p = req.params.postuladoId
  d = req.params.itemId
  OperacionesConjuntas.findOne({'cedula':p, _id: d}, (err, op) ->
    if err?
      handle_error(err, "Error eliminando operación conjunta: no encontrado", res)
    else
      if (op)
        op.remove((err) ->
          if err?
            handle_error(err, "Error eliminando operación conjunta", res)
          else
            logger.info "Operación conjunta con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_op_conjunta = (req, res) ->
  logger.debug "get empty op_conjunta"
  logger.debug(req.body)
  p = req.params.postuladoId
  oc = new OperacionesConjuntas()
  oc.cedula = p
  oc.titulo = req.body.titulo
  oc.save((err) ->
    if err?
      handle_error(err, "Error en create_op_conjunta", res)
    else
      res.send(oc)
      logger.info("Nueva op_conjunta creada y retornada")
  )

exports.save_op_conjunta = (req, res) ->
  logger.debug "Grabar op conjunta"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para grabar op_conjunta: Postulado no encontrado")
    #pp = req.body
    #pp.postulado_nombre = p.nombres + " " + p.apellidos
    OperacionesConjuntas.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error grabando op_conjunta.", res)
        return
      res.send("op_conjunta grabada ok")
      logger.info("op_conjunta grabada con exito")
    )
  )

exports.jyp_op_conjunta = (req, res) ->
  logger.debug "GET todas op_conjuntas"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  OperacionesConjuntas.find({'cedula':p}, (err, pps) ->
    if err?
      handle_error(err, "Error accedendo a relaciones autoridades.", res)
    else
      res.send(pps)
      logger.info("RelacionesAutoridades de postulado retornadas")
    )

exports.msg_opcon= (req, res) ->
  h = req.body
  id = req.params.opconId
  OperacionesConjuntas.findById(id, (err, opcon) ->
    if err?
      handle_error(err, "Operacion Conjunta para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      opcon.mensaje = h.mensaje
      opcon.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para OperacionConjunta", res)
        else
          res.send(opcon)
      )
  )

########################################################
## RELACIONES AUTORIDADES
########################################################
exports.del_relaut = (req, res) ->
  logger.debug "delete relaut"
  p = req.params.postuladoId
  d = req.params.itemId
  RelacionesAutoridades.findOne({'cedula':p, _id: d}, (err, ra) ->
    if err?
      handle_error(err, "Error eliminando relación autoridad: no encontrado", res)
    else
      if (ra)
        ra.remove((err) ->
          if err?
            handle_error(err, "Error eliminando relación autoridad", res)
          else
            logger.info "Relación autoridad con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_relaut = (req, res) ->
  logger.debug "get empty RELAUT"
  logger.debug(req.body)
  p = req.params.postuladoId
  ra = new RelacionesAutoridades()
  ra.cedula = p
  ra.titulo = req.body.titulo
  ra.save((err) ->
    if err?
      handle_error(err, "Error en create_relaut", res)
    res.send(ra)
    logger.info("Nueva relaut creada y retornada")
  )

exports.save_relaut = (req, res) ->
  logger.debug "Grabar pp"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para grabar relaut: Postulado no encontrado")
    #pp = req.body
    #pp.postulado_nombre = p.nombres + " " + p.apellidos
    RelacionesAutoridades.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error grabando relaut.", res)
        return
      res.send("pp grabada ok")
      logger.info("pp grabada con exito")
    )
  )

exports.jyp_relaut = (req, res) ->
  logger.debug "GET todas relauts"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  RelacionesAutoridades.find({'cedula':p}, (err, pps) ->
    if err?
      handle_error(err, "Error accedendo a relaciones autoridades.", res)
    res.send(pps)
    logger.info("RelacionesAutoridades de postulado retornadas")
    )



exports.msg_relaut= (req, res) ->
  h = req.body
  id = req.params.relautId
  RelacionesAutoridades.findById(id, (err, relaut) ->
    if err?
      handle_error(err, "Relacion Autoridad para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      relaut.mensaje = h.mensaje
      relaut.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para Relacion Autoridad", res)
        else
          res.send(relaut)
      )
  )

########################################################
## PP
########################################################
exports.del_pp = (req, res) ->
  logger.debug "delete parapolitica"
  p = req.params.postuladoId
  d = req.params.itemId
  Parapolitica.findOne({'cedula':p, _id: d}, (err, pp) ->
    if err?
      handle_error(err, "Error eliminando parapolitica: no encontrado", res)
    else
      if (pp)
        pp.remove((err) ->
          if err?
            handle_error(err, "Error eliminando parapolitica", res)
          else
            logger.info "Parapolitica con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_pp = (req, res) ->
  logger.debug "get empty pp"
  logger.debug(req.body)
  p = req.params.postuladoId
  pp = new Parapolitica()
  pp.cedula = p
  pp.titulo = req.body.titulo
  pp.save((err) ->
    if err?
      handle_error(err, "Error en create_pp", res)
    res.send(pp)
    logger.info("Nueva pp creada y retornada")
  )

exports.save_pp = (req, res) ->
  logger.debug "Grabar pp"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para grabar pp: Postulado no encontrado")
    #pp = req.body
    #pp.postulado_nombre = p.nombres + " " + p.apellidos
    Parapolitica.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error grabando pp.", res)
        return
      res.send("pp grabada ok")
      logger.info("pp grabada con exito")
    )
  )

exports.jyp_pp = (req, res) ->
  logger.debug "GET todas pps"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  Parapolitica.find({'cedula':p}, (err, pps) ->
    if err?
      handle_error(err, "Error accedendo a pps.", res)
    res.send(pps)
    logger.info("pps de postulado retornadas")
    )


exports.msg_pp= (req, res) ->
  h = req.body
  id = req.params.ppId
  Parapolitica.findById(id, (err, pp) ->
    if err?
      handle_error(err, "Parapolitica para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      pp.mensaje = h.mensaje
      pp.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para Parapolitica ", res)
        else
          res.send(pp)
      )
  )

########################################################
## FOSAS
########################################################
exports.del_fosa = (req, res) ->
  logger.debug "delete fosa"
  p = req.params.postuladoId
  d = req.params.itemId
  Fosa.findOne({'cedula':p, _id: d}, (err, f) ->
    if err?
      handle_error(err, "Error eliminando fosa: no encontrado", res)
    else
      if (f)
        f.remove((err) ->
          if err?
            handle_error(err, "Error eliminando fosa", res)
          else
            logger.info "Fosa con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_fosa = (req, res) ->
  logger.debug "get empty fosa"
  logger.debug(req.body)
  p = req.params.postuladoId
  f = new Fosa()
  f.titulo = req.body.titulo
  f.cedula = p
  f.save((err) ->
    if err?
      handle_error(err, "Error en create_fosa", res)
    res.send(f)
    logger.info("Nueva fosa creada y retornada")
  )

exports.save_fosa = (req, res) ->
  logger.debug "Grabar fosa"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para grabar fosa: Postulado no encontrado")
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    Fosa.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error grabando fosa.", res)
        return
      res.send("Fosa grabada ok")
      logger.info("Fosa grabada con exito")
    )
  )

exports.jyp_fosas = (req, res) ->
  logger.debug "GET todas fosas"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  Fosa.find({'cedula':p}, (err, fosas) ->
    if err?
      handle_error(err, "Error accedendo a fosas.", res)
    res.send(fosas)
    logger.info("Fosas de postulado retornadas")
    )

exports.msg_fosa= (req, res) ->
  h = req.body
  id = req.params.fosaId
  Fosa.findById(id, (err, fosa) ->
    if err?
      handle_error(err, "Fosa para grabar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      fosa.mensaje = h.mensaje
      fosa.save((err) ->
        if err?
          handle_error(err, "Error grabando mensaje para Fosa", res)
        else
          res.send(fosa)
      )

    )
########################################################
## 
########################################################
exports.codigos = (req, res) ->
  logger.debug "GET codigos"
  CodigoPenal.find({}, (err, codigos) ->
    if err?
      handle_error(err, "Error accediendo a la lista de codigos penales", res)
    res.send(codigos)
    logger.info "Lista codigos penales retornada con éxito."
  )

getPostulado = (req, res) ->
  logger.debug("_get postulado")
  p = req.params.postuladoId
  if not p?
    handle_error( new Error("Error accedendo a postulado."), "Postulado con cedula " + p " no encontrado", res)
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado.")
    res.send(postulado)
    logger.info("Postulado retornado")
    )


getHv = (req, res) ->
  logger.debug("_get hoja de vida")
  p = req.params.postuladoId
  if not p?
    handle_error(new Error(), "Error accedendo a postulado.", res)
  Hoja.find({'cedula':p}, (err, hv_postulado) ->
    if err?
      handle_error(err, "Error accedendo a postulado.", res)
    res.send(hv_postulado)
    logger.info("Hoja de vida de postulado retornada")
    )

saveHv = (req, res) ->
  logger.debug("_grabando hoja de vida...")
  p = req.params.postuladoId
  p_dir =  __dirname + "/media/postulados/" + p + "/hv/remis"
  i_dir =  __dirname + "/media/postulados/" + p + "/hv/imput"
  remis = req.body.remisiones
  remis_file_name_only = []
  if remis and remis.length > 0
    for r in remis
      remis_file_name_only.push(r.substring(r.lastIndexOf("/") + 1))  

  imput = req.body.imputaciones
  imput_file_name_only = []
  if imput and imput.length > 0
    for i in imput 
      imput_file_name_only.push(i.substring(i.lastIndexOf("/") + 1))  
  
  if fs.existsSync(p_dir)
    listing = fs.readdirSync(p_dir)
    if listing.length > 0
      for l in listing 
        if remis_file_name_only.indexOf(l) < 0
          logger.info("Found a file to delete in Hoja remisiones array: " + l)
          fs.unlinkSync(p_dir + "/" + l)
          logger.info("Deleted.")

  if fs.existsSync(i_dir)
    listing = fs.readdirSync(i_dir)
    if listing.length > 0
      for l in listing 
        if imput_file_name_only.indexOf(l) < 0
          logger.info("Found a file to delete in Hoja remisiones array: " + l)
          fs.unlinkSync(i_dir + "/" + l)
          logger.info("Deleted.")

  Hoja.update('cedula': p, req.body , {upsert: true}, (err) ->
    if err?
      handle_error(err, "Error grabando hoja de vida.", res)
    res.send("HV saved ok")
    logger.info("Hoja de vida grabada con exito")
  )

getDelitos = (req, res) ->
  logger.debug("_get informacion justicia y paz")
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  Delito.find({'cedula':p}, (err, hechos_postulado) ->
    if err?
      handle_error(err, "Error accedendo a postulado.", res)
    res.send(hechos_postulado)
    logger.info("Hechos de postulado retornados")
    )

_save_delito = (req, res) ->
  logger.debug("_save_delito: " + req.body.titulo)
  logger.debug(req.body)
  id = req.body._id
  delete req.body._id
  obj = new Delito(req.body)
  obj.fecha_version = convert_date(req.body.fecha_version)
  upsert_data = obj.toObject()
  delete upsert_data._id
  
  Delito.update({'_id': id }, upsert_data, (err) ->
    if err?
      handle_error(err, "Error grabando delito.", res)
      return
    res.send("Delito grabado ok")
    logger.info("Delito grabado con exito")
  )

crea_delito = (req, res) ->
  logger.debug("_crea_delito")
  logger.debug(req.body)
  p = req.params.postuladoId
  d = new Delito()
  d.titulo = req.body.titulo
  d.cedula = p
  d.save((err) ->
    if err?
      handle_error(err, "Error en get_empty_delito", res)
    res.send(d)
    logger.info("Nuevo delito creado y retornado")
  )

docs_upload = (req, res) ->
  logger.debug("_docs_upload")

  if req.method isnt "POST"
    handle_error(new Error(), "Metodo ilegal de acceso", res)
  else
    form = new multiparty.Form()

    form.parse(req, (err, fields, files) ->
      if err?
        handle_error(err, "Error in form upload", res)
      else
        logger.debug(files)
        p         = req.params.postuladoId
        path      = fields.path
        p_root_dir=  __dirname + "/media/postulados/"
        p_dir     =  __dirname + "/media/postulados/" + p + "/"
        root_dir  =  __dirname + "/media/postulados/" + p + "/" + path + "/"
        id        = fields.path_id[0]
        logger.debug("params----p: " + p + "--path: " + path + "--root_dir: " + root_dir + "--id: " + id)

        try 
          fs.readFile(files.uploadedFile[0].path, (err, data) ->
            try
              newPath = root_dir + id + "/" + files.uploadedFile[0].originalFilename
              if not fs.existsSync(p_root_dir)
                logger.debug ("creating p_root_dir: " + p_root_dir)
                fs.mkdirSync(p_root_dir) 
              if not fs.existsSync(p_dir)
                logger.debug ("creating p_dir: " + p_dir)
                fs.mkdirSync(p_dir)
              if not fs.existsSync(root_dir)
                logger.debug ("creating root_dir: " + root_dir)
                fs.mkdirSync(root_dir)
              if id.indexOf("/") > 0                
                subdir = id.substring(0, id.indexOf("/"))
                logger.debug ("subdir: " + subdir)
                base_dir = root_dir + subdir
                if not fs.existsSync(base_dir )
                  logger.debug ("creating base_dir with root_dir: " + root_dir + " - subdir: " + subdir)
                  fs.mkdirSync(base_dir)
              else
                logger.debug "indexOf was: " + id.indexOf("/")
              if not fs.existsSync(root_dir + id)
                logger.debug ("creating root_dir + id: " + root_dir + id)
                fs.mkdirSync(root_dir + id)

              
              fs.writeFile(newPath, data, (err, delito) ->
                if err?
                  handle_error(err, "Error guardando archivo subido", res)
                else
                  logger.info("Archivo subido con éxito.")
                  res.send(files.uploadedFile[0].originalFilename)
                )
            catch e
              handle_error(e, "Error guardando archivo", res)
          )
        catch e
          handle_error(e, "Error al subir archivo", res)
    )


exports.delete_video = (req, res) ->
  logger.debug("_delete_video")

  cedula = req.params.postuladoId
  id     = req.params.delitoId

  Postulado.findOne({'cedula':cedula} ,(err, postulado) ->
    if err?
      handle_error(err, "Error eliminando video: ese postulado no existe", res)
    else
      Delito.findById(id, (err, delito) ->
        if err?
          handle_error(err, "Error eliminando video: ese delito no existe", res)
        else
          root_dir = __dirname + "/media/postulados/"
          full_dir = root_dir + cedula + "/delitos/"
          full_file = full_dir + id + "/" + delito.video_path

          try
            if fs.existsSync(full_file) and delito.video_path != '' 
              fs.unlinkSync(full_file)
            else
              logger.warning("El video que quieres eliminar no existe! Voy a borrar la entrada en la base de datos, para que puedas subir un nuevo!")
          catch e
            logger.error("Video no se puede eliminar de file system. Params: cedula: " + cedula + " - path: " + full_dir + " - video: " + delito.video_path + " - full_file: " + full_file)
            handle_error(err, "Error eliminando video: error eliminando del file system.", res)
            
            return 
          delito.video_path = ""
          delito.save()
          logger.info("Video para delito eliminado con éxito.")
          res.send(delito)
      )
  )
  
  

video_upload = (req, res) ->
  logger.debug("_video_upload")

  if req.method isnt "POST"
    handle_error(new Error(), "Metodo ilegal de acceso", res)
  else
    form = new multiparty.Form()

    form.parse(req, (err, fields, files) ->
      if err?
        handle_error(err, "Error in form upload", res)
      else
        p        = req.params.postuladoId
        Postulado.findOne({'cedula':p} ,(err, postulado) ->
          if err?
            handle_error(err, "Error subiendo video: ese postulado no existe", res)
          else
            root_dir = __dirname + "/media/postulados/"
            full_dir = root_dir + p + "/delitos/"
            id       = fields.delitoId
            
         
            fs.readFile(files.uploadedFile[0].path, (err, data) ->
              try
                newPath = full_dir + id + "/" + files.uploadedFile[0].originalFilename
                if not fs.existsSync(root_dir)
                  fs.mkdirSync(root_dir)
                if not fs.existsSync(root_dir + p)
                  fs.mkdirSync(root_dir + p)
                if not fs.existsSync(full_dir)
                  fs.mkdirSync(full_dir)
                if not fs.existsSync(full_dir + id)
                  fs.mkdirSync(full_dir + id)
                fs.writeFile(newPath, data, (err, delito) ->
                  if err?
                   handle_error(err, "Error guardando video subido", res)
                  else
                    Delito.findById(id,(err, delito) ->
                      if err?
                        handle_error(err, "Video subido pero no se encontro delito asociado", res)
                      else
                        logger.debug delito
                        if delito?
                          delito.video_path = files.uploadedFile[0].originalFilename
                          delito.save((err) ->
                          if err?
                            handle_error(err, "Video subido ok, delito encontrado, pero al grabarlo hubo error", res)
                          else
                            logger.info ("Video subido con exito.")
                            res.send(delito)
                          )
                        else
                          handle_error(new Error("Delito es vacio"), "No se encontro el delito asociado a esa id", res)
                    )
                  )
              catch e
                handle_error(e, "Error guardando video", res)
              )
        )
    )

avatar_upload = (req, res) ->
  logger.debug("_avatar_upload")

  root_dir =  __dirname + "/media/postulados/"
  p = req.params.postuladoId

  if req.method isnt "POST"
    handle_error(new Error(), "Metodo ilegal de acceso", res)
  else
    form = new multiparty.Form()

    form.parse(req, (err, fields, files) ->
      if err?
        handle_error(err, "Error in form upload", res)
      else
        fs.readFile(files.uploadedFile[0].path, (err, data) ->
          try
            newPath = root_dir + p + "/" + files.uploadedFile[0].originalFilename
            if not fs.existsSync(root_dir + p)
              fs.mkdirSync(root_dir + p)
            fs.writeFile(newPath, data, (err, delito) ->
              if err?
               handle_error(err, "Error guardando imagen subida", res)
              else
                Postulado.findOne({'cedula':p} ,(err, postulado) ->
                  if err?
                    handle_error(err, "Imagen subido pero no se encontro Postulado asociado", res)
                  else
                    logger.debug postulado
                    if postulado?
                      postulado.picture = "/img/" + p + "/" + files.uploadedFile[0].originalFilename
                      postulado.save((err) ->
                      if err?
                        handle_error(err, "Imagen subida ok, Postulado encontrado, pero al grabarlo hubo error", res)
                      else
                        res.send(postulado)
                      )
                    else
                      handle_error(new Error("Postulado es vacio"), "No se encontro el Postulado asociado a esa cedula", res)
                )
              )
          catch e
            handle_error(e, "Error guardando imagen", res)
          )
    )


_get_all_data = (data_objects, res) ->
  logger.debug "_get_all_data for informes"
  try
    all = {} 
    cnt = 0
    Postulado.find({}, (err, postulados) ->
      logger.debug postulados
      if err?
        handle_error(err, "Error accedendo a todos los datos de postulado para informe", res)
      else
        if postulados?
          logger.debug("gefore foreeach")
          postulados.forEach (p) ->
            logger.debug("in foreeach")
            _get_all_postulado_objects(p.cedula, data_objects, (objects) ->
              all[p.cedula] = []
              all[p.cedula].push(p)
              all[p.cedula].push(objects)
        
              cnt += 1
              if cnt is postulados.length
                logger.info("Voy retornando todos los datos!")
                logger.debug(all)
                res.send(all)
            )
        else
          handle_error(new Error(), "No hay postulados encontrados",res)
    )
  catch e
    handle_error(e, "Error al acceder a información de informes", res)



exports._get_all_postulado_objects = (cedula, data_objects, callback) ->
    returns = {}
    cnt = 0
    data_objects.forEach (obj) ->
      logger.debug "Getting objects for " + obj.modelName
      obj.find({'cedula': cedula}, (err, objects) ->
        if err?
          handle_error(err, err.message, res)
        else
          #logger.debug "Results: " + objects
          name = obj.modelName
          logger.debug name
          returns[name] = objects
          cnt += 1
          if cnt is data_objects.length
            logger.info "All data retrieved"
            #logger.debug returns
            #return returns
            callback(returns)
        )

_get_all_postulado_data = (cedula, data_objects, res) ->
  logger.debug "_get_all_postulado_data for informes"
  logger.debug cedula
  try
    _get_all_postulado_objects(cedula, data_objects, (objects) ->
      res.send(objects)
    )
  catch e
    handle_error(e, e.message, res )
