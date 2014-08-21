########################################
### MAIN APP
########################################
require('coffee-script')
require('coffee-trace')
flash     = require('connect-flash')
express   = require('express')
passport  = require('passport')
mongoose  = require('mongoose')
config    = require('./config')
urls      = require('./urls')
routes    = require('./routes')
media     = require('./media')
pdf       = require('./pdf')
logger    = require('./logger')

MongoStore = require('connect-mongo')(express)
User      = require('./models/models').User
Postulado = require('./models/models').Postulado

handle_error = require('./utils').handle_error

#Connect to DB
db = mongoose.connect(config.creds.mongoose_auth_local)


########################################
# MIDDLEWARE CALLS
########################################

#Middleware to check if a user can access the info
can_access = (req, res, cedula=null, next) ->
  role = req.user.role
  if cedula is null
    cedula = req.params.postuladoId
  user_cedula = req.user.cedula
  Postulado.findOne({ cedula:cedula }, (err, user) ->
    if err?
      handle_error(err, err.message, res)
    if not user?
      text = "No se encontró postulado con esa cédula"
      logger.debug(text)
      handle_error(err, text, res)
    else if not cedula == user_cedula or role is not "admin"
      text = "No se encontró postulado con esa cédula"
      logger.debug(text)
      handler_error(new Error(text), text, res)
    else
      logger.debug "Login: can access, ok"
      next()
    )

#Middleware to check if it's the user's own info 
is_mine = (req, res, next) ->
  cedula = req.user.cedula
  req.params.postuladoId = cedula
  Postulado.findOne({ cedula:cedula }, (err, user) ->
    if err?
      handle_error(err, err.message, res)
    if not user?
      text = "No se encontró postulado con esa cédula"
      logger.debug(text)
      handle_error(err, text, res)
    else
      logger.debug("Login: is_mine ok")
      next()
    )

#Middleware to check that user can view video
can_view_video = (req, res, next) ->
    url = req.url
    url_params_only = url.substring("/videos/".length)
    cedula = url_params_only.substring(0, url_params_only.indexOf("/"))
    can_access(req, res, cedula, (err) ->
      if err?
        handle_error(err, err.message, res)
      else
        return next()
    )

can_view_imagen = (req, res, next) ->
    #url = req.url
    #url_params_only = url.substring("/img/".length)
    #cedula = url_params_only.substring(0, url_params_only.indexOf("/"))
    cedula = req.params.cedulaId
    logger.debug("Requesting img for cedula: " + cedula)
    can_access(req, res, cedula, (err) ->
      if err?
        handle_error(err, err.message, res)
      else
        return next()
    )

#Middleware to check that a user is authenticated
ensureAuthenticated = (req, res, next) ->
      if (req.isAuthenticated())
          return next()
      logger.debug("Not authenticated!")
      res.redirect('/')

#Middleware to check that a user has admin role 
ensureAdmin = (req, res, next) ->
      if (req.user.role == "admin")
          return next()
      logger.debug( "Not admin!")
      res.redirect('/')



#INSTANTIATE EXPRESS
app = module.exports = express()

#set up passport
LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({usernameField: 'cedula'}, (cedula, password, done) ->
    logger.debug("new local strategy")
    User.findOne({ cedula: cedula }, (err, user) ->
      #logger.debug("findone")
      if err?
         logger.debug("error in findone")
         return done(err)
      if not user
        logger.info("Acceso no otorgado: Usuario incorrecto")
        return done(null, false, { message: 'Acceso no otorgado: Usuario invalido.' })
      #logger.debug(user.password)
      #logger.debug(password)
      if password isnt user.password
         logger.debug("Contraseña NO corresponde!")
         return done(null, false, {message: "Acceso no otorgado: Contraseña invalida." })
      logger.debug("Login todo bien")
      done(null,user)
    )
))

########################
#configure the app
########################
app.configure( () ->
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.urlencoded())
  app.use(express.json())
  #app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser())
  app.use(express.session({
    secret:'siarsecret',
    maxAge: new Date(Date.now() + 86400000), #1 day
    store: new MongoStore( {db:mongoose.connections[0].db})
  }))
  app.use(express.static(__dirname + '/public'))
  app.use(express.static(__dirname + '/../../public'))
  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(app.router)
)
app.configure('development', () ->
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
)
app.configure('production', () ->
      app.use(express.errorHandler())
)


# Passport session setup.
# To support persistent login sessions, Passport needs to be able to
# serialize users into and deserialize users out of the session. Typically,
# this will be as simple as storing the user ID when serializing, and finding
# the user by ID when deserializing.
passport.serializeUser((user, done) ->
      done(null, user._id)
)

passport.deserializeUser((id, done) ->
      User.findById(id, (err, user) ->
         done(err, user)
      )
)
########################
#  Routes
########################
app.get('/', routes.index)


app.post '/login', (req, res, next) ->
  passport.authenticate('local', (err, user, info) ->
    logger.debug("authenticate callback")
    if err?
      logger.error("err in authenticate callback")
      return next(err)
    if not user
      logger.debug("User NOT in auth callback")
      req.flash("loginerror", info.message)
      return res.redirect('/login')
    req.logIn user, (err) ->
      if err?
        logger.error( err)
        res.redirect("/", { message: req.flash(err)})
        return
      logger.debug( user.role)
      if user.role is "admin" or user.role is "auditor"
        logger.debug("redirecting to tablero")
        res.redirect("/tablero")
      else
        logger.debug("redirecting to inicio")
        res.redirect("/inicio")
  )(req, res, next)



app.all('*',ensureAuthenticated)

app.get('/ping', routes.ping)
app.get('/logout', routes.logout)
app.get('/inicio', routes.inicio)
app.get('/tablero', routes.tablero)
app.get('/codigopenal', routes.codigos)

app.get('/minfo', is_mine, routes.postulado)
app.get('/minfo/hv', is_mine, routes.hv)
app.get('/minfo/jyp_delitos', is_mine, routes.jyp_delitos)
app.get('/minfo/jyp_fosas', is_mine, routes.jyp_fosas)
app.get('/minfo/jyp_parapolitica', is_mine, routes.jyp_pp)
app.get('/minfo/jyp_relaut', is_mine, routes.jyp_relaut)
app.get('/minfo/jyp_op_conjunta', is_mine, routes.jyp_op_conjunta)
app.get('/minfo/bienes', is_mine, routes.bienes)
app.get('/minfo/menores', is_mine, routes.menores)
app.get('/minfo/proces', is_mine, routes.proces)
app.get('/minfo/pdf', is_mine, pdf.get_pdf)
app.post('/minfo/pwd', routes.pwd)
app.post('/send_message', routes.send_message)

app.put('/minfo/hv/msg', is_mine, routes.msg_hv)
app.put('/minfo/delitos/:delitoId/msg', is_mine, routes.msg_delito)
app.put('/minfo/fosas/:fosaId/msg', is_mine, routes.msg_fosa)
app.put('/minfo/pp/:ppId/msg', is_mine, routes.msg_pp)
app.put('/minfo/relaut/:relautId/msg', is_mine, routes.msg_relaut)
app.put('/minfo/opcon/:opconId/msg', is_mine, routes.msg_opcon)
app.put('/minfo/bienes/:bienId/msg', is_mine, routes.msg_bien)
app.put('/minfo/menores/:menorId/msg', is_mine, routes.msg_menor)
app.put('/minfo/procesos/:procesoId/msg', is_mine, routes.msg_proceso)

app.get('/postulados/:postuladoId', can_access, routes.postulado)
app.get('/postulados/:postuladoId/hv', can_access, routes.hv)
app.get('/postulados/:postuladoId/jyp_delitos', can_access, routes.jyp_delitos)
app.get('/postulados/:postuladoId/jyp_fosas', can_access, routes.jyp_fosas)
app.get('/postulados/:postuladoId/jyp_parapolitica', can_access, routes.jyp_pp)
app.get('/postulados/:postuladoId/jyp_relaut', can_access, routes.jyp_relaut)
app.get('/postulados/:postuladoId/jyp_op_conjunta', can_access, routes.jyp_op_conjunta)
app.get('/postulados/:postuladoId/bienes', can_access, routes.bienes)
app.get('/postulados/:postuladoId/menores', can_access, routes.menores)
app.get('/postulados/:postuladoId/proces', can_access, routes.proces)

app.get('/docs/:postuladoId/:type/:typeId/:file', can_access, media.get_doc)
app.get('/postulados/:postuladoId/view_docs/:type/:typeId', can_access, media.view_docs)
app.get('/videos/:cedulaId/:delitoId/:name', can_view_video, media.play)
app.get('/img/:cedulaId/:name', can_view_imagen, media.img_view)

#admin routes
app.get('/admin', ensureAdmin, routes.admin)
app.get('/admin/messages', ensureAdmin, routes.messages)
app.get('/admin/get_messages', ensureAdmin, routes.get_messages)
app.post('/admin/messages/:msgId', ensureAdmin, routes.msg_read)
app.delete('/admin/messages/:msgId', ensureAdmin, routes.msg_delete)

app.post('/admin/codigopenal/new', ensureAdmin, routes.new_codigo)
app.put('/admin/codigopenal/:codigoId', ensureAdmin, routes.update_codigo)
app.delete('/admin/codigopenal/:codigoId', ensureAdmin, routes.delete_codigo)

app.put('/admin/save_user', ensureAdmin, routes.save_user)
app.put('/admin/save_postulado', ensureAdmin, routes.save_postulado)
app.delete('/admin/delete_postulado/:postuladoId', ensureAdmin, routes.delete_postulado)
app.delete('/admin/delete_user/:userId', ensureAdmin, routes.delete_user)
app.get('/admin/usuarios/usuarios.json', ensureAdmin, routes.usuarios)

app.get('/admin/postulados/:postuladoId/informe',can_access,  routes.informe_postulado)
app.get('/admin/informe',ensureAdmin,routes.informe)

app.post('/admin/postulados/:postuladoId/videoupload', ensureAdmin, can_access, routes.upload_video)
app.delete('/admin/postulados/:postuladoId/videoupload/:delitoId', ensureAdmin, can_access, routes.delete_video)
app.post('/admin/postulados/:postuladoId/avatarupload', ensureAdmin,can_access, routes.upload_avatar)
app.post('/admin/postulados/:postuladoId/docsupload', ensureAdmin, can_access, routes.upload_docs)
app.put('/admin/postulados/:postuladoId/hv',can_access,  routes.save_hv)

app.put('/admin/postulados/:postuladoId/jyp_fosa/c',can_access,  routes.create_fosa)
app.put('/admin/postulados/:postuladoId/jyp_fosa/u',can_access,  routes.save_fosa)
app.del('/admin/postulados/:postuladoId/jyp_fosa/:itemId',can_access,  routes.del_fosa)

app.put('/admin/postulados/:postuladoId/jyp_parapolitica/c',can_access,  routes.create_pp)
app.put('/admin/postulados/:postuladoId/jyp_parapolitica/u',can_access,  routes.save_pp)
app.del('/admin/postulados/:postuladoId/jyp_parapolitica/:itemId',can_access,  routes.del_pp)

app.put('/admin/postulados/:postuladoId/jyp_relaut/c',can_access,  routes.create_relaut)
app.put('/admin/postulados/:postuladoId/jyp_relaut/u',can_access,  routes.save_relaut)
app.del('/admin/postulados/:postuladoId/jyp_relaut/:itemId',can_access,  routes.del_relaut)

app.put('/admin/postulados/:postuladoId/jyp_op_conjunta/c',can_access,  routes.create_op_conjunta)
app.put('/admin/postulados/:postuladoId/jyp_op_conjunta/u',can_access,  routes.save_op_conjunta)
app.del('/admin/postulados/:postuladoId/jyp_op_conjunta/:itemId',can_access,  routes.del_op_conjunta)

app.put('/admin/postulados/:postuladoId/jyp_delito/c',can_access,  routes.create_delito)
app.put('/admin/postulados/:postuladoId/jyp_delito/u',can_access,  routes.save_delito)
app.del('/admin/postulados/:postuladoId/jyp_delito/:itemId',can_access,  routes.del_delito)

app.put('/admin/postulados/:postuladoId/bienes/c',can_access,  routes.create_bien)
app.put('/admin/postulados/:postuladoId/bienes/u',can_access,  routes.save_bien)
app.del('/admin/postulados/:postuladoId/bienes/:itemId',can_access,  routes.del_bien)

app.put('/admin/postulados/:postuladoId/menores/c',can_access,  routes.create_menor)
app.put('/admin/postulados/:postuladoId/menores/u',can_access,  routes.save_menor)
app.del('/admin/postulados/:postuladoId/menores/:itemId',can_access,  routes.del_menor)

app.put('/admin/postulados/:postuladoId/proces/c',can_access,  routes.create_proces)
app.put('/admin/postulados/:postuladoId/proces/u',can_access,  routes.save_proces)
app.del('/admin/postulados/:postuladoId/proces/:itemId',can_access,  routes.del_proces)

app.get('/admin/postulados/postulados.json', ensureAdmin, routes.postulados)

app.get('/admin/partials/:name',(req, res) ->
   name = req.params.name
   res.render('admin/partials/' + name)
)

app.get('/partials/:name',(req, res) ->
   name = req.params.name    
   res.render('partials/' + name, {is_admin: "admin" == req.user.role})
)

########################
#Start the app
########################
app.listen(config.app.port, () ->
      logger.info("Express server listening on port " + config.app.port + " in " + app.settings.env + " mode")
)
