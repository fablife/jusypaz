logger = require('./logger')

exports.handle_error = (exception, text, res, code=500) ->
    logger.error(text)
    logger.error(exception)
    res.send(code, text)

exports.convert_date = (date) ->
   elems = date.split("/")
   #console.log("d: "+elems[0] + " m: " +elems[1] + " y: " + elems[2])
   new_date = elems[2] + "/" + elems[1] + "/" + elems[0]
   #console.log new_date
   return new Date(new_date)


