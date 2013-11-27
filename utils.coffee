exports.handle_error = (exception, text, res, code=500) ->
    console.log(text)
    console.log exception
    res.statusCode = code
    res.end(text)

exports.convert_date = (date) ->
   elems = date.split("/");
   #console.log("d: "+elems[0] + " m: " +elems[1] + " y: " + elems[2])
   new_date = elems[2] + "/" + elems[1] + "/" + elems[0]
   #console.log new_date
   return new Date(new_date)


