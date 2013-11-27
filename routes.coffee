Postulado   = require('./models/models').Postulado
Usuario     = require('./models/models').User
Hoja        = require("./models/models").Hoja
Delito      = require("./models/models").Delito
Fosa        = require("./models/models").Fosa
Bien        = require("./models/models").Bien
Menor       = require("./models/models").Menor
Proceso     = require("./models/models").Proceso
Parapolitica= require("./models/models").Parapolitica
RelacionesAutoridades = require("./models/models").RelacionesAutoridades
OperacionesConjuntas = require("./models/models").OperacionesConjuntas

CodigoPenal = require("./models/models").CodigoPenal

handle_error = require("./utils").handle_error
convert_date = require("./utils").convert_date

fs = require('fs')

exports.index = (req,res) ->
  res.render('index')

exports.logout = (req, res) ->
  req.logout();
  res.redirect('/');

exports.tablero = (req,res) ->
  res.render('tablero', {role: req.user.role})

exports.inicio = (req,res) ->
  res.render('inicio',{role: req.user.role})

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
    obj = req.body
    obj.fecha_nacimiento = convert_date(obj.fecha_nacimiento)
    p = new Postulado(obj)
    p.save((err) -> 
      if err?
       handle_error(err,"Error creando nuevo postulado!",res)
      else
       console.log("Postulado " + p.nombres + " " + p.apellidos + " salvado.")
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
       
    )

exports.delete_user = (req,res) ->
  console.log "Delete user"
  id = req.params.userId
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
          usuario.remove((err) ->
            if err?
              handle_error(err, "Error eliminando Usuario con id " + id, res)
            else
              res.send("OK")
              console.log "Usuario eliminado con éxito"
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

exports.create_delito = (req, res) ->
  console.log "get empty delito"  
  crea_delito(req, res)

exports.save_delito = (req, res) ->
  console.log "Salvar delito"  
  save_delito(req, res)

exports.jyp_delitos = (req, res) ->
  console.log "GET informacion de delitos justicia y paz"
  getDelitos(req, res)

########################################################
## PROCESOS
########################################################
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
      handle_error(error, "Error accedendo a postulado para salvar proceso: Postulado no encontrado")
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
  Proceso.find({'cedula':p}, (err, menores) ->
    if err?
      handle_error(err, "Error accedendo a procesos.", res)
    res.send(menores)
    console.log("procesos de postulado retornadas")
    )



########################################################
## MENORES
########################################################
exports.create_menor = (req, res) ->
  console.log "create menor" 
  console.log(req.body)
  p = req.params.postuladoId
  m = new Menor()
  m.cedula_menor = req.body.cedula
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
    #fosa = req.body
    #fosa.postulado_nombre = p.nombres + " " + p.apellidos
    obj = req.body
    date = obj.fecha_ingreso
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

########################################################
## BIENES
########################################################
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

########################################################
## OPERACIONES CONJUNTAS
########################################################
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

########################################################
## RELACIONES AUTORIDADES
########################################################
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



########################################################
## PP
########################################################
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


########################################################
## FOSAS
########################################################
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
  console.log("_save_delito: " + req.body.titulo)
  id = req.body._id
  delete req.body._id
  Delito.update({'_id': id }, req.body, (err) ->
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

video_upload = (req, res) ->
  console.log("_video_upload")
  console.log req.body
  console.log req.files.uploadedFile.path
  root_dir =  __dirname + "/media/delitos/"
  p = req.body.postuladoId
  id = req.body.delitoId

  fs.readFile(req.files.uploadedFile.path, (err, data) ->
    try
      newPath = root_dir + p + "/" + id + "/" + req.files.uploadedFile.name
      if not fs.existsSync(root_dir + p)
        fs.mkdirSync(root_dir + p)
      if not fs.existsSync(root_dir + p + "/" + id)
        fs.mkdirSync(root_dir + p + "/" + id)
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
                delito.video_path = req.files.uploadedFile.name
                delito.save((err) ->
                if err?
                  handle_error(err, "Video subido ok, delito encontrado, pero al salvarlo hubo error", res)
                else
                  res.send(delito)
                )
              else
                handle_error(new Error("Delito es vacio"), "No se encontro el delito asociado a esa id", res)
          )
        )
    catch e
      handle_error(e, "Error guardando video", res)
    )

avatar_upload = (req, res) ->
  console.log("_avatar_upload")
  console.log req.body
  console.log req.files.uploadedFile.path
  root_dir =  __dirname + "/media/postulados/"
  p = req.body.postuladoId

  fs.readFile(req.files.uploadedFile.path, (err, data) ->
    try
      newPath = root_dir + p + "/" + req.files.uploadedFile.name
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
                postulado.picture = "/img/" + p + "/" + req.files.uploadedFile.name;
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
