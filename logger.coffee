####################################### 
### Logging 
#######################################
config  = require './config'
colors = require('colors')

exports.debug = (obj) ->
    if config.env.debug
      console.log(("[DEBUG] " + obj).blue)

exports.info = (obj) ->
    console.log(("[INFO] " + obj).green)

exports.error = (obj) ->
  console.log(("[ERROR] " + obj).red)
  
exports.warning = (obj) ->
    console.log(("[WARNING] " + obj).yellow)

