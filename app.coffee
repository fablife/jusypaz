require('coffee-script')
require('coffee-trace')
flash     = require('connect-flash')
express   = require('express')
passport  = require('passport')
mongoose  = require('mongoose')
config    = require('./config')
urls      = require('./urls')
routes    = require('./routes')
User      = require('./models/models').User

#Connect to DB
db = mongoose.connect(config.creds.mongoose_auth_local)

# Passport session setup.
# To support persistent login sessions, Passport needs to be able to
# serialize users into and deserialize users out of the session. Typically,
# this will be as simple as storing the user ID when serializing, and finding
# the user by ID when deserializing.
passport.serializeUser((user, done) ->
      done(null, user)
)

passport.deserializeUser((id, done) ->
      done(null,id)
      #findById(id, (err, user) ->
      #   done(err, user)
      #)
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
passport.use(new LocalStrategy( (username, password, done) ->
    User.findOne({ username: username }, (err, user) ->
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
passport_options =
  successRedirect: '/tablero'
  failureRedirect: '/'
  failureFlash: true

app.post('/login', passport.authenticate('local', passport_options))
app.all('*',ensureAuthenticated)

app.get('/tablero', routes.tablero)
app.get('/codigopenal', routes.codigos)
app.get('/postulados/:postuladoId', routes.postulado)
app.get('/postulados/:postuladoId/hv', routes.hv)
app.get('/postulados/:postuladoId/jyp_delitos', routes.jyp_delitos)

#admin routes
app.get('/admin', ensureAdmin, routes.admin)
app.put('/admin/save_user', routes.save_user)
app.put('/admin/save_postulado', routes.save_postulado)
app.get('/admin/usuarios/usuarios.json', ensureAdmin, routes.usuarios)
app.post('/admin/postulados/:postuladoId/videoupload', routes.upload_video)
app.put('/admin/postulados/:postuladoId/hv', routes.save_hv)
app.put('/admin/postulados/:postuladoId/jyp', routes.create_delito)
app.put('/admin/postulados/:postuladoId/jyp_delito', routes.save_delito)
app.get('/admin/postulados/postulados.json', ensureAdmin, routes.postulados)

app.get('/admin/partials/:name',(req, res) ->
   name = req.params.name
   res.render('admin/partials/' + name)
)


app.get('/partials/:name',(req, res) ->
   name = req.params.name
   res.render('partials/' + name)
)

########################
#Start the app
########################
app.listen(config.app.port, () ->
      console.log("Express server listening on port %d in %s mode", config.app.port, app.settings.env)
)
