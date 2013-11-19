require('coffee-script')
require('coffee-trace')
mongoose    = require('mongoose')
config      = require('../config')
CodigoPenal = require('../models/models').CodigoPenal

db = mongoose.connect(config.creds.mongoose_auth_local)

codigos = ["Homicidio agravado","Homicidio en persona protegida","Desaparición forzada","Secuestro simple",
"Secuestro extorsivo","Violaciones","Lesiones personales","Hurto agravado","Hurto calificado","Extorsión",
"Porte ilegal de armas","Esacciones ilegales - Finanzas maderas","Esacciones ilegales - Finanzas peajes",
"Esacciones ilegales - Finanzas empresas de gas","Esacciones ilegales - Finanzas comercio en general",
"Esacciones ilegales - Finanzas ganaderos y finqueros","Constreñimiento electoral","Masacres",
"Tortura","Terrorismo","Concierto para delinquir","Tráfico fabricación o porte de estupefacientes",
"Delitos etnias - Indígenas","Delitos etnias - Afrodescendientes","Desplazamiento forzado",
"Despojo de tierras","Amenazas personales o familiares","Tentativa de homicidio",
"Entrenamiento para actividades ilicitas","Lavado de activos","Fabricación y tráfico de armas de fuego o municiones",
"Testaferrato","Uso de elementos, uniformes e insignias de uso privativo de las fuerzas militares",
"Apoderamiento de aeronaves y/o medios de transporte",
"Apoderamiento de aeronaves, naves o medios de transporte colectivo",
"Violación de la libertad de trabajo","Daño a bien ajeno","Contrabando","Instigación a delinquir"]

err_cnt = 0
results = 0 
console.log "Iniciando a salvar los códigos..."
console.log "Son: " + codigos.length + " codigos."

for c in codigos
  console.log "Salvando a " + c
  p = new CodigoPenal()
  p.nombre = c
  p.save((err) ->
    if err?
      err_cnt += 1
      #console.log "No se pudo salvar el código penal " + c + "! Razón: " + err
      console.log "No se pudo salvar el código penal! Razón: " + err
      results += 1
    else
      #console.log c + " salvado con éxito."
      results += 1
    if results == codigos.length
      if err_cnt > 0
        console.log "Hubo errores en salvar la lista de código penal."
        process.exit(-1)
      else
        console.log "Toda la lista salvada con éxito."
        process.exit(0)
  )

