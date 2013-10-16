require('coffee-script')
require('coffee-trace')
flash    = require('connect-flash')
express  = require('express')
passport = require('passport')
mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/jusypaz')

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

#exports.ensureAuthenticated = ensureAuthenticated(req, res, next) ->
ensureAuthenticated = (req, res, next) ->
      if (req.isAuthenticated())
          return next()
      res.redirect('/')

User = mongoose.model('User',
 {
     username: String
    ,password: String
 })

app = module.exports = express()

routes   = require('./routes')

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
        done(null,user)
    )
))

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

app.get('/', routes.index)
passport_options =
  successRedirect: '/tablero'
  failureRedirect: '/'
  failureFlash: true 

app.post('/login', passport.authenticate('local', passport_options))

app.all('*',ensureAuthenticated)
app.get('/tablero', routes.tablero)

port = 3333

app.listen(port, () ->
      console.log("Express server listening on port %d in %s mode", port, app.settings.env)
)
