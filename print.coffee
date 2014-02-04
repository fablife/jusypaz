########################################
### All print routes
########################################
phantom = require('phantom')

exports.print_hv = (req, res) ->
  _get_as_pdf("/inicio/#index","Hoja_De_Vida")

_get_as_pdf = (path, name) ->
  phantom.create((ph) ->
    ph.createPage((page) -> 
      page.open(path, (status) -> 
        page.render(name + ".pdf", () ->
 
         console.log('Page Rendered')
         ph.exit()
 
       )
     )
   )
  )

