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
  console.log ("new codigo")

  if req.method isnt "POST"
    handle_error(new Error(), "Invalid access", res)
  else
    codigo = req.body.codigo
    console.log req.body
    
    if codigo?
      cp = new CodigoPenal()
      cp.nombre = codigo
      cp.save((err) ->
        if err?
          handle_error(err, "Error salvando el nuevo codigo penal.", res)
        else
          console.log "Nuevo código salvado con éxito"
          res.send("OK")
      )
    else 
      handle_error(new Error(), "Informacion enviada invalida.", res)


exports.messages = (req, res) ->
  console.log("messages")

  Message.find({'read': false}, (err, messages) ->
    if err?
      handle_error(err, "Error chequeando los mensajes!", res)
    else
      console.log("Mensajes leidos")
      res.send(messages)
  )

exports.msg_read = (req, res) ->
  console.log("msg read")

  if req.method isnt "POST"
    handle_error(new Error(), "Invalid access", res)
  else  
    id = req.params.msgId
    console.log id
    console.log req.params

    if id?
      Message.findById(id, (err, message) ->
        if err?
          handle_error(err, "Error marcando mensaje leido!", res)
        else
          message.read = true;
          message.save((err) ->
            console.log("Mensaje marcado leidos")
            res.send("OK")
          )      
      )
    else
      handle_error(new Error(), "Invalid message id", res)

exports.msg_delete = (req, res) ->
  console.log("msg delete")

  id = req.params.msgId
  if id?
    Message.findById(id, (err, msg) ->
      if err?
        handle_error(err, "Error eliminando mensaje!", res)
      else
        msg.remove((err) ->
          console.log "Mensaje eliminado con éxito"
          res.send("OK")
        )
    )
  else
    handle_error(new Error(), "Invalid message id", res)

exports.get_messages = (req, res) ->
  console.log("messages")

  Message.find((err, messages) ->
    if err?
      handle_error(err, "Error chequeando los mensajes!", res)
    else
      console.log("Mensajes leidos")
      res.send(messages)
  )

exports.pwd = (req, res) ->
  console.log("change pwd")

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
              handle_error(err, "No se pudo salvar la nueva contraseña!", res)
            else
              console.log "Nueva contraseña salvada con éxito"
              res.send("OK")
          )
    )

exports.send_message = (req, res) ->
  console.log "send message"

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
            handle_error(err, "No se pudo salvar el mensaje mandado.", res)
          else
            console.log "Nuevo mensaje guardado en el sistema con éxito"
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

exports.save_user = (req,res) ->
    console.log ("save_user")
    console.log (req.body)
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
        console.log("Usuario " + u.username + " salvado.")
        res.send("Usuario salvado")
    )

exports.save_postulado = (req,res) ->
    console.log ("save_postulado")
    console.log (req.body)
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
          console.log("Postulado " + p.nombres + " " + p.apellidos + " salvado.")
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
              console.log("Objeto usuario con contraseña estandar para postulado " + p.nombres + " " + p.apellidos + " creado.")
              res.send("Postulado salvado")
            )
          else
            res.send("Postulado salvado")         
      )

exports.delete_user = (req,res) ->
  console.log "Delete user"
  id = req.params.userId
  if id is String(req.user._id)
    handle_error(new Error("No puedo eliminar el usuario actual! " + id), "No puedo eliminar el usuario actual!", res)
    console.log "delete aborted"
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
                      console.log "Usuario eliminado con éxito"
                  )
              else
                handle_error(new Error("No puedo eliminar este usuario, es el último administrador!"), "No puedo eliminar este usuario, es el último administrador!", res)
          )
      )
  )

exports.delete_postulado = (req,res) ->
  console.log "Delete postulado"
  id = req.params.postuladoId
  Postulado.findById(id, (err, postulado) ->
    cedula = postulado.cedula
    if err?
      handle_error(err, "Error eliminado postulado: Postulado con esa id no existe. Id: " + id)
    else
      postulado.remove((err) ->
      if err?
        handle_error(err, "Error eliminando postulado con id " + id, res)
      else
        Usuario.remove({'cedula': cedula  }, (err) ->
          if err?
            handle_error(err, "Se eliminó el postulado con cedula: " + cedula + " pero no el usuario asociado!", res)
          else
            res.send("OK")
            console.log "Postulado y usuario asociado eliminado con éxito"
        )
      )
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
  getPostulado(req, res)
 
exports.upload_docs = (req, res) ->
  console.log("POST docs_upload")
  docs_upload(req, res)

exports.upload_video = (req, res) ->
  console.log("POST video_upload")
  video_upload(req, res)

exports.upload_avatar = (req, res) ->
  console.log("POST avatar_upload")
  avatar_upload(req, res)
  
exports.hv = (req, res) ->
  console.log "Hoja de vida"
  getHv(req, res)

exports.save_hv = (req, res) ->
  console.log "Salvar hoja de vida"
  saveHv(req, res)

exports.msg_hv = (req, res) ->
  h = req.body
  Hoja.findOne({cedula: req.user.cedula}, (err, hoja) ->
    if err?
      handle_error(err, "Hoja de vida para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      hoja.mensaje = h.mensaje
      hoja.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para hoja de vida", res)
        else
          res.send(hoja)
      )
  )
########################################################
## DELITOS 
########################################################
exports.create_delito = (req, res) ->
  console.log "get empty delito"
  crea_delito(req, res)

exports.save_delito = (req, res) ->
  console.log "Salvar delito"
  _save_delito(req, res)

exports.jyp_delitos = (req, res) ->
  console.log "GET informacion de delitos justicia y paz"
  getDelitos(req, res)

exports.del_delito = (req, res) ->
  console.log "delete delito"
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
            console.log "Delito con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.msg_delito = (req, res) ->
  h = req.body
  id = req.params.delitoId
  Delito.findById(id, (err, delito) ->
    if err?
      handle_error(err, "Delito para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      delito.mensaje = h.mensaje
      delito.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para delito", res)
        else
          res.send(delito)
      )
  )
########################################################
## PROCESOS
########################################################
exports.del_proces = (req, res) ->
  console.log "delete proces"
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
            console.log "Proceso con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_proces = (req, res) ->
  console.log "create proces"
  console.log(req.body)
  p = req.params.postuladoId
  m = new Proceso()
  m.titulo = req.body.titulo
  m.cedula = p
  m.save((err) ->
    if err?
      handle_error(err, "Error en create_proces", res)
    else
      res.send(m)
      console.log("Nuevo proceso creado y retornado")
  )

exports.save_proces = (req, res) ->
  console.log "Salvar proces"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(err, "Error accedendo a postulado para salvar proceso: Postulado no encontrado", res)
    else
       #fosa = req.body
       #fosa.postulado_nombre = p.nombres + " " + p.apellidos
       obj = req.body
       #date = obj.fecha_ingreso
       #obj.fecha_ingreso  = convert_date(date)
       Proceso.update({'_id': id }, obj, (err) ->
         if err?
           handle_error(err, "Error salvando menor.", res)
           return
         res.send("proceso salvado ok")
         console.log("proceso salvado con exito")
       )
  )

exports.proces = (req, res) ->
  console.log "GET todos proces"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a procesos."), "Postulado con cedula " + p + " no encontrado." , res)  
    return
  Proceso.find({'cedula':p}, (err, menores) ->
    if err?
      handle_error(err, "Error accedendo a procesos.", res)
    res.send(menores)
    console.log("procesos de postulado retornadas")
    )


exports.msg_proceso= (req, res) ->
  h = req.body
  id = req.params.procesoId
  Proceso.findById(id, (err, proc) ->
    if err?
      handle_error(err, "Proceso para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      proc.mensaje = h.mensaje
      proc.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para proceso", res)
        else
          res.send(proc)
      )
  )

########################################################
## MENORES
########################################################
exports.del_menor = (req, res) ->
  console.log "delete menor"
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
            console.log "Menor con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_menor = (req, res) ->
  console.log "create menor" 
  console.log(req.body)
  p = req.params.postuladoId
  m = new Menor()
  m.nombres = req.body.nombres
  m.cedula = p
  m.save((err) ->
    if err?
      handle_error(err, "Error en create_menor", res)
    else
      res.send(m)
      console.log("Nuevo menor creado y retornado")
  )

exports.save_menor = (req, res) ->
  console.log "Salvar menor"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para salvar menor: Postulado no encontrado")
      return
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    obj = req.body
    date = obj.fecha_ingreso
    if date
      obj.fecha_ingreso  = convert_date(date)
    Menor.update({'_id': id }, obj, (err) ->
      if err?
        handle_error(err, "Error salvando menor.", res)
        return
      res.send("menor salvado ok")
      console.log("menor salvado con exito")
    )
  )

exports.menores = (req, res) ->
  console.log "GET todos menores"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a menores."), "Postulado con cedula " + p + " no encontrado." , res)
  Menor.find({'cedula':p}, (err, menores) ->
    if err?
      handle_error(err, "Error accedendo a menores.", res)
    res.send(menores)
    console.log("menores de postulado retornadas")
    )

exports.msg_menor = (req, res) ->
  h = req.body
  id = req.params.menorId
  Menor.findById(id, (err, menor) ->
    if err?
      handle_error(err, "Menor para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      menor.mensaje = h.mensaje
      menor.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para menor", res)
        else
          res.send(menor)
      )
  )
########################################################
## BIENES
########################################################
exports.del_bien = (req, res) ->
  console.log "delete bien"
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
            console.log "Bien con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_bien = (req, res) ->
  console.log "create bien"
  console.log(req.body)
  p = req.params.postuladoId
  b = new Bien()
  b.titulo = req.body.titulo
  b.cedula = p
  b.save((err) ->
    if err?
      handle_error(err, "Error en create_bien", res)
    else
      res.send(b)
      console.log("Nuevo bien creado y retornado")
  )

exports.save_bien = (req, res) ->
  console.log "Salvar bien"
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
      handle_error(error, "Error accedendo a postulado para salvar bien: Postulado no encontrado")
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    Bien.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error salvando fosa.", res)
        return
      res.send("Bien salvado ok")
      console.log("Bien salvado con exito")
    )
  )

exports.bienes = (req, res) ->
  console.log "GET todos bienes"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a bienes."), "Postulado con cedula " + p + " no encontrado." , res)
  Bien.find({'cedula':p}, (err, bienes) ->
    if err?
      handle_error(err, "Error accedendo a bienes.", res)
    else
      res.send(bienes)
      console.log("Bienes de postulado retornadas")
    )

exports.msg_bien= (req, res) ->
  h = req.body
  id = req.params.bienId
  Bien.findById(id, (err, bien) ->
    if err?
      handle_error(err, "Bien para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      bien.mensaje = h.mensaje
      bien.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para bien", res)
        else
          res.send(bien)
      )
  )

########################################################
## OPERACIONES CONJUNTAS
########################################################
exports.del_op_conjunta = (req, res) ->
  console.log "delete op_conjunta"
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
            console.log "Operación conjunta con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_op_conjunta = (req, res) ->
  console.log "get empty op_conjunta"
  console.log(req.body)
  p = req.params.postuladoId
  oc = new OperacionesConjuntas()
  oc.cedula = p
  oc.titulo = req.body.titulo
  oc.save((err) ->
    if err?
      handle_error(err, "Error en create_op_conjunta", res)
    else
      res.send(oc)
      console.log("Nueva op_conjunta creada y retornada")
  )

exports.save_op_conjunta = (req, res) ->
  console.log "Salvar op conjunta"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para salvar op_conjunta: Postulado no encontrado")
    #pp = req.body
    #pp.postulado_nombre = p.nombres + " " + p.apellidos
    OperacionesConjuntas.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error salvando op_conjunta.", res)
        return
      res.send("op_conjunta salvada ok")
      console.log("op_conjunta salvada con exito")
    )
  )

exports.jyp_op_conjunta = (req, res) ->
  console.log "GET todas op_conjuntas"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  OperacionesConjuntas.find({'cedula':p}, (err, pps) ->
    if err?
      handle_error(err, "Error accedendo a relaciones autoridades.", res)
    else
      res.send(pps)
      console.log("RelacionesAutoridades de postulado retornadas")
    )

exports.msg_opcon= (req, res) ->
  h = req.body
  id = req.params.opconId
  OperacionesConjuntas.findById(id, (err, opcon) ->
    if err?
      handle_error(err, "Operacion Conjunta para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      opcon.mensaje = h.mensaje
      opcon.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para OperacionConjunta", res)
        else
          res.send(opcon)
      )
  )

########################################################
## RELACIONES AUTORIDADES
########################################################
exports.del_relaut = (req, res) ->
  console.log "delete relaut"
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
            console.log "Relación autoridad con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_relaut = (req, res) ->
  console.log "get empty RELAUT"
  console.log(req.body)
  p = req.params.postuladoId
  ra = new RelacionesAutoridades()
  ra.cedula = p
  ra.titulo = req.body.titulo
  ra.save((err) ->
    if err?
      handle_error(err, "Error en create_relaut", res)
    res.send(ra)
    console.log("Nueva relaut creada y retornada")
  )

exports.save_relaut = (req, res) ->
  console.log "Salvar pp"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para salvar relaut: Postulado no encontrado")
    #pp = req.body
    #pp.postulado_nombre = p.nombres + " " + p.apellidos
    RelacionesAutoridades.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error salvando relaut.", res)
        return
      res.send("pp salvada ok")
      console.log("pp salvada con exito")
    )
  )

exports.jyp_relaut = (req, res) ->
  console.log "GET todas relauts"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  RelacionesAutoridades.find({'cedula':p}, (err, pps) ->
    if err?
      handle_error(err, "Error accedendo a relaciones autoridades.", res)
    res.send(pps)
    console.log("RelacionesAutoridades de postulado retornadas")
    )



exports.msg_relaut= (req, res) ->
  h = req.body
  id = req.params.relautId
  RelacionesAutoridades.findById(id, (err, relaut) ->
    if err?
      handle_error(err, "Relacion Autoridad para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      relaut.mensaje = h.mensaje
      relaut.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para Relacion Autoridad", res)
        else
          res.send(relaut)
      )
  )

########################################################
## PP
########################################################
exports.del_pp = (req, res) ->
  console.log "delete parapolitica"
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
            console.log "Parapolitica con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_pp = (req, res) ->
  console.log "get empty pp"
  console.log(req.body)
  p = req.params.postuladoId
  pp = new Parapolitica()
  pp.cedula = p
  pp.titulo = req.body.titulo
  pp.save((err) ->
    if err?
      handle_error(err, "Error en create_pp", res)
    res.send(pp)
    console.log("Nueva pp creada y retornada")
  )

exports.save_pp = (req, res) ->
  console.log "Salvar pp"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para salvar pp: Postulado no encontrado")
    #pp = req.body
    #pp.postulado_nombre = p.nombres + " " + p.apellidos
    Parapolitica.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error salvando pp.", res)
        return
      res.send("pp salvada ok")
      console.log("pp salvada con exito")
    )
  )

exports.jyp_pp = (req, res) ->
  console.log "GET todas pps"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  Parapolitica.find({'cedula':p}, (err, pps) ->
    if err?
      handle_error(err, "Error accedendo a pps.", res)
    res.send(pps)
    console.log("pps de postulado retornadas")
    )


exports.msg_pp= (req, res) ->
  h = req.body
  id = req.params.ppId
  Parapolitica.findById(id, (err, pp) ->
    if err?
      handle_error(err, "Parapolitica para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      pp.mensaje = h.mensaje
      pp.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para Parapolitica ", res)
        else
          res.send(pp)
      )
  )

########################################################
## FOSAS
########################################################
exports.del_fosa = (req, res) ->
  console.log "delete fosa"
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
            console.log "Fosa con id " + d + " eliminado con éxito"
            res.send("OK", 204)
        )
  )

exports.create_fosa = (req, res) ->
  console.log "get empty fosa"
  console.log(req.body)
  p = req.params.postuladoId
  f = new Fosa()
  f.titulo = req.body.titulo
  f.cedula = p
  f.save((err) ->
    if err?
      handle_error(err, "Error en create_fosa", res)
    res.send(f)
    console.log("Nueva fosa creada y retornada")
  )

exports.save_fosa = (req, res) ->
  console.log "Salvar fosa"
  p = req.params.postuladoId
  id = req.body._id
  delete req.body._id
  #Check: maybe not needed? save nombre directly from form?
  Postulado.find({'cedula':p}, (err, postulado) ->
    if err?
      handle_error(error, "Error accedendo a postulado para salvar fosa: Postulado no encontrado")
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    Fosa.update({'_id': id }, req.body, (err) ->
      if err?
        handle_error(err, "Error salvando fosa.", res)
        return
      res.send("Fosa salvada ok")
      console.log("Fosa salvada con exito")
    )
  )

exports.jyp_fosas = (req, res) ->
  console.log "GET todas fosas"
  p = req.params.postuladoId
  if not p?
    handle_error(new Error("Error accedendo a postulado."), "Postulado con cedula " + p + " no encontrado." , res)
  Fosa.find({'cedula':p}, (err, fosas) ->
    if err?
      handle_error(err, "Error accedendo a fosas.", res)
    res.send(fosas)
    console.log("Fosas de postulado retornadas")
    )

exports.msg_fosa= (req, res) ->
  h = req.body
  id = req.params.fosaId
  Fosa.findById(id, (err, fosa) ->
    if err?
      handle_error(err, "Fosa para salvar observacion no encontrada", res)
    #else if h._id not hoja._id
    #  handle_error(err, "Error accediendo a hoja de vida de usuario en msg_hv", res)
    else
      fosa.mensaje = h.mensaje
      fosa.save((err) ->
        if err?
          handle_error(err, "Error salvando mensaje para Fosa", res)
        else
          res.send(fosa)
      )

    )
########################################################
## 
########################################################
exports.codigos = (req, res) ->
  console.log "GET codigos"
  CodigoPenal.find({}, (err, codigos) ->
    if err?
      handle_error(err, "Error accediendo a la lista de codigos penales", res)
    res.send(codigos)
    console.log "Lista codigos penales retornada con éxito."
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
    console.log("Hoja de vida salvada con exito")
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

_save_delito = (req, res) ->
  console.log("_save_delito: " + req.body.titulo)
  console.log(req.body)
  id = req.body._id
  delete req.body._id
  obj = new Delito(req.body)
  obj.fecha_version = convert_date(req.body.fecha_version)
  upsert_data = obj.toObject()
  delete upsert_data._id
  
  Delito.update({'_id': id }, upsert_data, (err) ->
    if err?
      handle_error(err, "Error salvando delito.", res)
      return
    res.send("Delito salvado ok")
    console.log("Delito salvado con exito")
  )

crea_delito = (req, res) ->
  console.log("_crea_delito")
  console.log(req.body)
  p = req.params.postuladoId
  d = new Delito()
  d.titulo = req.body.titulo
  d.cedula = p
  d.save((err) ->
    if err?
      handle_error(err, "Error en get_empty_delito", res)
    res.send(d)
    console.log("Nuevo delito creado y retornado")
  )

docs_upload = (req, res) ->
  console.log("_docs_upload")

  if req.method isnt "POST"
    handle_error(new Error(), "Metodo ilegal de acceso", res)
  else
    form = new multiparty.Form()

    form.parse(req, (err, fields, files) ->
      if err?
        handle_error(err, "Error in form upload", res)
      else
        console.log(files)
        p         = req.params.postuladoId
        path      = fields.path
        root_dir  =  __dirname + "/media/postulados/" + p + "/" + path + "/"
        id        = fields.path_id
        console.log("params----p: " + p + "--path: " + path + "--root_dir: " + root_dir + "--id: " +id)

        try 
          fs.readFile(files.uploadedFile[0].path, (err, data) ->
            try
              newPath = root_dir + id + "/" + files.uploadedFile[0].originalFilename
              if not fs.existsSync(root_dir)
                fs.mkdirSync(root_dir)
              if id.indexOf("/") > 0
                subdir = id.substring(0,id.indexOf("/"))
                if not fs.existsSync(root_dir + subdir )
                  fs.mkdirSync(root_dir + subdir)
              if not fs.existsSync(root_dir + id)
                fs.mkdirSync(root_dir + id)
              fs.writeFile(newPath, data, (err, delito) ->
                if err?
                  handle_error(err, "Error guardando archivo subido", res)
                else
                  console.log("Archivo subido con éxito.")
                  res.send(files.uploadedFile[0].originalFilename)
                )
            catch e
              handle_error(e, "Error guardando archivo", res)
          )
        catch e
          handle_error(e, "Error al subir archivo", res)
    )


video_upload = (req, res) ->
  console.log("_video_upload")

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
                        console.log delito
                        if delito?
                          delito.video_path = files.uploadedFile[0].originalFilename
                          delito.save((err) ->
                          if err?
                            handle_error(err, "Video subido ok, delito encontrado, pero al salvarlo hubo error", res)
                          else
                            console.log ("Video subido con exito.")
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
  console.log("_avatar_upload")

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
                    console.log postulado
                    if postulado?
                      postulado.picture = "/img/" + p + "/" + files.uploadedFile[0].originalFilename
                      postulado.save((err) ->
                      if err?
                        handle_error(err, "Imagen subida ok, Postulado encontrado, pero al salvarlo hubo error", res)
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
  console.log "_get_all_data for informes"
  try
    all = {} 
    cnt = 0
    Postulado.find({}, (err, postulados) ->
      console.log postulados
      if err?
        handle_error(err, "Error accedendo a todos los datos de postulado para informe", res)
      else
        if postulados?
          console.log("gefore foreeach")
          postulados.forEach (p) ->
            console.log("in foreeach")
            _get_all_postulado_objects(p.cedula, data_objects, (objects) ->
              all[p.cedula] = []
              all[p.cedula].push(p)
              all[p.cedula].push(objects)
        
              cnt += 1
              if cnt is postulados.length
                console.log("going to return all data!")
                console.log(all)
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
      console.log "Getting objects for " + obj.modelName
      obj.find({'cedula': cedula}, (err, objects) ->
        if err?
          handle_error(err, err.message, res)
        else
          #console.log "Results: " + objects
          name = obj.modelName
          console.log name
          returns[name] = objects
          cnt += 1
          if cnt is data_objects.length
            console.log "All data retrieved"
            #console.log returns
            #return returns
            callback(returns)
        )

_get_all_postulado_data = (cedula, data_objects, res) ->
  console.log "_get_all_postulado_data for informes"
  console.log cedula
  try
    _get_all_postulado_objects(cedula, data_objects, (objects) ->
      res.send(objects)
    )
  catch e
    handle_error(e, e.message, res )
