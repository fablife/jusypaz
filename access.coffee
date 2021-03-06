Postulado   = require('./models/models').Postulado
logger      = require('./logger')


exports.can_access = (req, res, cedula, callback) ->
  role = req.user.role
  user_cedula = req.user.cedula
  Postulado.findOne({ cedula:cedula }, (err, user) ->
    if err?
      callback(err)
      return
    if not user?
      text = "No se encontró postulado con esa cédula"
      logger.debug text
      callback(new Error(text))
    else if not cedula == user_cedula or role is not "admin"
      callback(new Error("No tiene derecho a acceder a ver esta información"))
    else
      logger.info "Can access"
      callback(null)
    )


