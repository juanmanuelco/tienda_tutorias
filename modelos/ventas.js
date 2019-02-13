mongoose = require('mongoose');

var ventaSchema = mongoose.Schema({
    Codigo:String,
    fecha: Date,
    total: Number,
    pedido: Array
})

//Exporta el esquema para poder ser usado en cada ruta que sea  necesario____________________________________________________________________
var ventas=module.exports=mongoose.model('ventas',ventaSchema);