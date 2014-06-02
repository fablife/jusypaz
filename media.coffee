fs            = require('fs')
handle_error  = require("./utils").handle_error
logger        = require("./logger")

exports.get_doc = (req,res) ->
  cedula = req.params.postuladoId
  type = req.params.type
  type_id = req.params.typeId
  file = req.params.file

  if type_id.indexOf("X") > 0 
    type_id = type_id.replace("XX","/")
  
  path =  __dirname + "/media/postulados/" + cedula + "/" + type + "/" + type_id + "/" + file

  fs.readFile(path, (err, data) ->
    if err?
      handle_error(err, "No se pudo leer el video", res)
    else
      res.send(data)
  )


exports.view_docs = (req, res) ->
    cedula  = req.params.postuladoId
    type    = req.params.type
    type_id = req.params.typeId

    logger.debug cedula
    logger.debug type
    logger.debug type_id

    if type_id.indexOf("X") > 0 
      type_id = type_id.replace("XX","/")

    docs_path =  __dirname + "/media/postulados/" + cedula + "/" + type + "/" + type_id

    fs.readdir(docs_path, (err, files) ->
        if err?
            handle_error(err, "No se pudo leer el contenido de la carpeta " + docs_path, res)
        else
            logger.debuginfo("Carpeta de documentos " + docs_path + " retornada con éxito.")
            res.send(files)
    )

exports.play = (req,res) ->

    logger.debug req.params
    #url     = req.url
    #sub     = url.substring("/videos/".length)
    #cedula  = sub.substring(0, sub.indexOf("/"))
    #delito  = sub.substring((cedula + "/").length)
    #delito  = delito.substring(0, delito.indexOf("/"))
    #video   = delito.substring((delito + "/").length)
    cedula  = req.params.cedulaId
    delito  = req.params.delitoId
    video   = req.params.name

    logger.debug delito
    logger.debug video
    logger.debug cedula 

    video_path = __dirname + "/media/postulados/" + cedula + "/delitos/" + delito + "/" + video 

    fs.readFile(video_path, (err, data) ->
        if err?
          handle_error(err, "No se pudo leer el video", res)
        else
            range = req.headers.range
            if range?
                total = data.length

                parts = range.replace(/bytes=/, "").split("-")
                partialstart = parts[0]
                partialend = parts[1]

                start = parseInt(partialstart, 10)
                end = if partialend then parseInt(partialend, 10) else total-1
            
                chunksize = (end-start)+1

                res.writeHead(206, 
                    "Content-Range": "bytes " + start + "-" + end + "/" + total,
                    "Accept-Ranges": "bytes", 
                    "Content-Length": chunksize, 
                    "Content-Type": 'video/mp4' )
            else
                res.writeHead(200,
                    "Content-Length": data.length,
                    "Content-Type": 'video/mp4')
            res.end(data)
    )


exports.img_view = (req,res) ->

    logger.debug req.params
    #url     = req.url
    #sub     = url.substring("/videos/".length)
    #cedula  = sub.substring(0, sub.indexOf("/"))
    #delito  = sub.substring((cedula + "/").length)
    #delito  = delito.substring(0, delito.indexOf("/"))
    #video   = delito.substring((delito + "/").length)
    cedula  = req.params.cedulaId
    img     = req.params.name

    logger.debug img
    logger.debug cedula 

    img_path = __dirname + "/media/postulados/" + cedula + "/" + img

    fs.readFile(img_path, (err, data) ->
        if err?
          handle_error(err, "No se pudo leer la imagen", res)
        else
            res.writeHead(200,
                "Content-Length": data.length)
            res.end(data)
    )
