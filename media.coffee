fs            = require('fs')
handle_error  = require("./utils").handle_error

exports.play = (req,res) ->

    console.log req.params
    #url     = req.url
    #sub     = url.substring("/videos/".length)
    #cedula  = sub.substring(0, sub.indexOf("/"))
    #delito  = sub.substring((cedula + "/").length)
    #delito  = delito.substring(0, delito.indexOf("/"))
    #video   = delito.substring((delito + "/").length)
    cedula  = req.params.cedulaId
    delito  = req.params.delitoId
    video   = req.params.name

    console.log delito
    console.log video
    console.log cedula 

    video_path = __dirname + "/media/delitos/" + cedula + "/" + delito + "/" + video 

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

    console.log req.params
    #url     = req.url
    #sub     = url.substring("/videos/".length)
    #cedula  = sub.substring(0, sub.indexOf("/"))
    #delito  = sub.substring((cedula + "/").length)
    #delito  = delito.substring(0, delito.indexOf("/"))
    #video   = delito.substring((delito + "/").length)
    cedula  = req.params.cedulaId
    img     = req.params.name

    console.log img
    console.log cedula 

    img_path = __dirname + "/media/postulados/" + cedula + "/" + img

    fs.readFile(img_path, (err, data) ->
        if err?
          handle_error(err, "No se pudo leer la imagen", res)
        else
            res.writeHead(200,
                "Content-Length": data.length)
            res.end(data)
    )
