exports.index = (req,res) ->
  res.render('index')

exports.tablero = (req,res) ->
  res.render('tablero',{role: req.user.role})

exports.admin = (req,res) ->
  res.render('admin/index')

exports.consulta_cedula = (req,res) ->
    console.log "called!"
    if req.body.cedula is "12345678"
        res.end("OK!!!!")
    else
        res.end(":-(")

exports.save_postulado = (req,res) ->
    console.log ("saving postulado!")
    console.log (req.body)
    res.end("OK!!!!")
