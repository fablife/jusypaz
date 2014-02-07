####################################### 
### Crear PDF para postulado 
#######################################
phantom = require 'phantom'
config  = require './config'
fs      = require 'fs'
Postulado   = require('./models/models').Postulado
Hoja        = require("./models/models").Hoja
Delito      = require("./models/models").Delito
Fosa        = require("./models/models").Fosa
Bien        = require("./models/models").Bien
Menor       = require("./models/models").Menor
Proceso     = require("./models/models").Proceso
Parapolitica= require("./models/models").Parapolitica
RelacionesAutoridades = require("./models/models").RelacionesAutoridades
OperacionesConjuntas = require("./models/models").OperacionesConjuntas

_get_all = require('./routes')._get_all_postulado_objects

exports.get_pdf = (req, res) ->
  classes = [Postulado,Hoja,Delito,Fosa,Bien,Menor,Proceso,Parapolitica,RelacionesAutoridades,OperacionesConjuntas]
  _get_all(req.user.cedula,classes, (obj) ->
    res.render('partials/pdf_view',{postulado: obj['Postulado'][0], objects: obj}, (err, html) ->
      if err?
        console.log("Error cargando vista par crear PDF!" + err)
      else
        if not fs.existsSync('files')
          fs.mkdirSync('files')
        file = req.user.username + Date.now() + ".pdf";
        filename = "files/siar_" + file 
        phantom.create( (ph) ->
          ph.createPage((page) -> 
            page.set('paperSize',
                    {
                        format: 'letter',
                        orientation: 'potrait',
                        border:'1cm'
                    }
            )
            page.set('content', html, () -> 
              console.log("Reading page from html seems to have succeeded...")
              page.render(filename, () ->
                console.log('Archivo PDF generado con éxito.')
                
                fs.readFile(filename, (err, data) ->
                  if err?
                    console.log("Error reading the pdf file from disk to return to user!")
                    res.send(500)
                  else
                    console.log("PDF generado y retornado con éxito a usuario.")
                    res.setHeader("Content-Disposition", 'attachment; filename="' + file + '"')
                    res.type('application/pdf')
                    res.end(data, 'binary') 
                )
                ph.exit()
              )
            )
          )
        )
    )
  )
