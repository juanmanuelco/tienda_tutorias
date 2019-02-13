mongoose = require('mongoose');

var productoEsquema = mongoose.Schema({
    Codigo:String,
    Nombre:String,
    Precio: String,
    Existencia:Number
})

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var productos=module.exports=mongoose.model('productos',productoEsquema);