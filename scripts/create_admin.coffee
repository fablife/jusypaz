require('coffee-script')
require('coffee-trace')
mongoose  = require('mongoose')
config    = require('../config')
User      = require('../models/models').User


db = mongoose.connect(config.creds.mongoose_auth_local)

admin = new User({
    username : "fabio",
    password : "1234",
    role : "admin"
})

console.log "Going to save admin user with username: " + admin.username
admin.save( (err) ->
    if err?
        console.log("Somethin went wrong.")
        console.log(err)
        process.exit(-1)
    else
        console.log "Done."
        process.exit(0)
)

