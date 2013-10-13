require('coffee-script')
require('coffee-trace')
flash    = require('connect-flash')
express  = require('express')
passport = require('passport')
mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/jusypaz')

User = mongoose.model('User', 
 {
     username: String
    ,password: String
 })

app = module.exports = express()

routes   = require('./routes')

LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy( (username, password, done) ->
    console.log "aaaa"
    User.findOne({ username: username }, (err, user) ->
      console.log("findone")
      if err
         console.log "error"
         return done(err)
      if not user
        console.log("incorrect username")
        return done(null, false, { message: 'Incorrect username.' })
      
      if not user.validPassword(password)
        console.log("incorrect password")
        return done(null, false, { message: 'Incorrect password.' })
      
      console.log("bla")
      return done(null, user)
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
)


app.configure('development', () ->
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
)

app.configure('production', () ->
      app.use(express.errorHandler())
)

app.get('/', routes.index)
app.get('/tablero', routes.tablero)


passport_options =
  successRedirect: '/tablero'
  failureRedirect: '/'
  failureFlash: true

app.post('/login',
  passport.authenticate('local', passport_options)
)

port = 3333

app.listen(port, () ->
      console.log("Express server listening on port %d in %s mode", port, app.settings.env)
)
