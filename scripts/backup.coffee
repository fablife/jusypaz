##################################################################
### SCRIPT PARA BACKUP DE LA BASE DE DATOS Y LOS ARCHIVOS SUBIDOS
##################################################################
shell = require('shelljs')
conf  = require('../config')
fs    = require('fs')

console.log("**********************************************************************************************************************")
console.log("Ejecución de script para backup del SIAR")
console.log("Haré un backup de la base de datos y de los archivos subidos")


setDateZero = (date) ->
  if date < 10 
    return '0' + date 
  else
    return date;

returned_scripts = 0

try
    backup_root_dir = conf.backup.dir
    date = new Date()
    y = date.getFullYear()
    m = setDateZero(date.getMonth() + 1)
    d = setDateZero(date.getDate())
    h = date.getHours()
    mm = date.getMinutes()
    s = date.getSeconds()
    date_formatted = "" + y + m + d + h + mm + s 
    backup_dir = backup_root_dir + "/" + date_formatted
    db_dir = backup_dir + "/db"
    files_dir = backup_dir + "/archivos"
    
    console.log("Después de la ejecución, encontrarás los archivos de la base de datos en " + db_dir + " y los archivos subidos en " + files_dir)
    console.log()
    console.log("Arranco!")
    
    if not fs.existsSync(backup_root_dir)
       fs.mkdirSync(backup_root_dir)
    if not fs.existsSync(backup_dir)
       fs.mkdirSync(backup_dir)
    if not fs.existsSync(db_dir)
       fs.mkdirSync(db_dir)
    if not fs.existsSync(files_dir)
       fs.mkdirSync(files_dir)
    
    dbcmd = 'mongodump -d jusypaz -o ' + db_dir 
    dbenv = shell.exec(dbcmd,{silent:true}, (code, output) ->
      #console.log("Code de mongodb: " + code)
      #console.log("Output de mongodb: " + output)
      finish()
    )
    zipcmd = "zip -r " + files_dir + "/archivos.zip " + conf.backup.source_files 
    zipenv = shell.exec(zipcmd,{silent: true}, (code, output) ->
      #console.log("Code de archivos: " + code)
      #console.log("Output de archivos: " + output) 
      if code == 0
        finish()
      else
        oops()
    )
    
catch e
  console.log("OOOoooops. Algo no me fue bien. No terminé la tarea con éxito. Error: " + e)

finish = () ->
  returned_scripts += 1
  if returned_scripts == 2  
    console.log()
    console.log("**********************************************************************************************************************")
    console.log("Ya acabé. Ejecución terminada con éxito.")
    console.log("**********************************************************************************************************************")


oops = () ->
  console.log("OOOoooops. Algo no me fue bien. No terminé la tarea con éxito...:-( ")

