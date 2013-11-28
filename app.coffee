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
User      = require('./models/models').User
Postulado = require('./models/models').Postulado

handle_error = require('./utils').handle_error

#Connect to DB
db = mongoose.connect(config.creds.mongoose_auth_local)

# Passport session setup.
# To support persistent login sessions, Passport needs to be able to
# serialize users into and deserialize users out of the session. Typically,
# this will be as simple as storing the user ID when serializing, and finding
# the user by ID when deserializing.
passport.serializeUser((user, done) ->      
      done(null, user._id)
)

passport.deserializeUser((id, done) ->
      #done(null,id)
      User.findById(id, (err, user) ->
         done(err, user)
      )
)

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
      console.log text
      handle_error(err, text, res)
    else if not cedula == user_cedula or role is not "admin"
      text = "No se encontró postulado con esa cédula"
      console.log text
      handler_error(new Error(text), text, res)
    else
      console.log "Can access"
      next()
    )

is_mine = (req, res, next) ->
  cedula = req.user.cedula
  req.params.postuladoId = cedula
  Postulado.findOne({ cedula:cedula }, (err, user) ->
    if err?
      handle_error(err, err.message, res)
    if not user?
      text = "No se encontró postulado con esa cédula"
      console.log text
      handle_error(err, text, res)
    else
      console.log "is mine ok"
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
    console.log "Requesting img for cedula: " + cedula
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
      console.log "Not authenticated!"
      res.redirect('/')

#Middleware to check that a user has admin role 
ensureAdmin = (req, res, next) ->
      if (req.user.role == "admin")
          return next()
      console.log "Not admin!"
      res.redirect('/')

app = module.exports = express()

#set up passport
LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({usernameField: 'cedula'}, (cedula, password, done) ->

    User.findOne({ cedula: cedula }, (err, user) ->
      #console.log("findone")
      if err
         #console.log "error"
         return done(err)
      if not user
        #console.log("incorrect username")
        return done(null, false, { message: 'Incorrect username.' })
      else
        #console.log(user.password) 
        if (password != user.password)
          return done(null, false, {message: "Incorrect password" })
        done(null,user)
    )
))

########################
#configure the app
########################
app.configure( () ->
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser('terces'))
  app.use(express.session())
  app.use(express.static(__dirname + '/public'))
  app.use(flash())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(app.router)
  app.use(express.static(__dirname + '/../../public'))
)
app.configure('development', () ->
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
)
app.configure('production', () ->
      app.use(express.errorHandler())
)

########################
#  Routes
########################
app.get('/', routes.index)
#passport_options =
#  successRedirect: '/tablero'
#  failureRedirect: '/'
#  failureFlash: true

#app.post('/login', passport.authenticate('local', passport_options))
#app.post('/login', (req, res, next) ->    
#    passport.authenticate('local', (err, user, info) ->
#      if err?
#        console.log "err!" + err
#        return next(err) 
#      if not user 
#        console.log "not user"
#        return res.redirect("/")
#      req.logIn(user, (err) -> 
#        console.login("haha")
#        if err?
#          return next(err)
#        if user.role is "admin"
#          console.login("jeje")
#          res.redirect("/tablero")
#        else
#          res.redirect("/inicio")
#      )
#    )
#)
app.post '/login', (req, res, next) ->
  passport.authenticate('local', (err, user, info) ->
    return next(err) if err?
    return res.redirect('/login') if not user?
    req.logIn user, (err) ->
      return next(err) if err?
      if user.role is "admin" or "auditor"
        res.redirect("/tablero")
      else
        res.redirect("/inicio") 
  )(req, res, next)



app.all('*',ensureAuthenticated)

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

app.get('/videos/:cedulaId/:delitoId/:name', can_view_video, media.play)
app.get('/img/:cedulaId/:name', can_view_imagen, media.img_view)

#admin routes
app.get('/admin', ensureAdmin, routes.admin)
app.put('/admin/save_user', ensureAdmin, routes.save_user)
app.put('/admin/save_postulado', ensureAdmin, routes.save_postulado)
app.delete('/admin/delete_postulado/:postuladoId', ensureAdmin, routes.delete_postulado)
app.delete('/admin/delete_user/:userId', ensureAdmin, routes.delete_user)
app.get('/admin/usuarios/usuarios.json', ensureAdmin, routes.usuarios)

app.post('/admin/postulados/:postuladoId/videoupload', ensureAdmin, can_access, routes.upload_video)
app.post('/admin/postulados/:postuladoId/avatarupload', ensureAdmin,can_access, routes.upload_avatar)
app.put('/admin/postulados/:postuladoId/hv',can_access,  routes.save_hv)

app.put('/admin/postulados/:postuladoId/jyp_fosa/c',can_access,  routes.create_fosa)
app.put('/admin/postulados/:postuladoId/jyp_fosa/u',can_access,  routes.save_fosa)

app.put('/admin/postulados/:postuladoId/jyp_parapolitica/c',can_access,  routes.create_pp)
app.put('/admin/postulados/:postuladoId/jyp_parapolitica/u',can_access,  routes.save_pp)

app.put('/admin/postulados/:postuladoId/jyp_relaut/c',can_access,  routes.create_relaut)
app.put('/admin/postulados/:postuladoId/jyp_relaut/u',can_access,  routes.save_relaut)

app.put('/admin/postulados/:postuladoId/jyp_op_conjunta/c',can_access,  routes.create_op_conjunta)
app.put('/admin/postulados/:postuladoId/jyp_op_conjunta/u',can_access,  routes.save_op_conjunta)

app.put('/admin/postulados/:postuladoId/jyp_delito/c',can_access,  routes.create_delito)
app.put('/admin/postulados/:postuladoId/jyp_delito/u',can_access,  routes.save_delito)

app.put('/admin/postulados/:postuladoId/bienes/c',can_access,  routes.create_bien)
app.put('/admin/postulados/:postuladoId/bienes/u',can_access,  routes.save_bien)

app.put('/admin/postulados/:postuladoId/menores/c',can_access,  routes.create_menor)
app.put('/admin/postulados/:postuladoId/menores/u',can_access,  routes.save_menor)

app.put('/admin/postulados/:postuladoId/proces/c',can_access,  routes.create_proces)
app.put('/admin/postulados/:postuladoId/proces/u',can_access,  routes.save_proces)

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
      console.log("Express server listening on port %d in %s mode", config.app.port, app.settings.env)
)
