####################################### 
### Logging 
#######################################
config  = require './config'

exports.debug = (obj) ->
    if config.env.debug
      console.log("[DEBUG] " + obj)

exports.info = (obj) ->
    console.log("[INFO] " + obj)

exports.error = (obj) ->
  console.log("[ERROR] " + obj)
