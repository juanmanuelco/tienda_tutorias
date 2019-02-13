
express = require('express');
router = express.Router();
Producto = require('../modelos/productos')
Ventas = require('../modelos/ventas')


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  database : 'db_tienda'
});

connection.connect();
 


//consultar-producto
router.get('/', (req,res)=>{
    res.render('inicio')
})
router.get('/integrar', (req, res)=>{
    res.render('integrar')
})
router.get('/modificar-eliminar', (req,res)=>{

    connection.query(`SELECT * FROM productos `, (error, productos, fields)=>{
        if (error) throw error;
        productos=productos.sort(()=> {return Math.random() - 0.5})
        res.render('mod_eli', {productos:productos})
    });

})
router.post('/obtener-producto', (req,res)=>{
    connection.query(`SELECT * FROM productos where Codigo=${req.body.Codigo} LIMIT 1`, (error, producto, fields)=>{
        if (error) throw error;
        res.send(producto[0])
    });
})
router.get('/pocos', (req,res)=>{
    connection.query(`SELECT * FROM productos`, (error, productos, fields)=>{
        if (error) throw error;
        productos=productos.sort(()=> {return Math.random() - 0.5})
        res.render('pocos', {productos:productos})
    });
})

router.get('/ventas', (req,res)=>{
    var fecha= new Date()
    res.render('ventas', {fecha:cuadrarFecha(fecha)})
})
function cuadrarFecha(fecha){
    var dia= fecha.getDate()
    var mes= fecha.getMonth()+1
    var ano=fecha.getFullYear()
    if(dia<10) dia= "0"+dia
    if (mes<10) mes="0"+mes
    return (ano+"-"+mes+"-"+dia)
}
function fechaCorrecta(fecha){
    var parts =fecha.split('-');
    var mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
    return mydate
}




function obtenerCAD(data){
    if(data.length<2) return '0'+data
    else return data
 }
 function getFecha(fecha){
    fecha=new Date(fecha).toLocaleDateString()
    fecha=fecha.split('-')
    return obtenerCAD(fecha[0])+'-'+ obtenerCAD(fecha[1])+'-'+ obtenerCAD(fecha[2])
 }
 function getHora(fecha){
    hora=new Date(fecha).toLocaleTimeString().split(':')
    return obtenerCAD(hora[0])+':'+obtenerCAD(hora[1])
 }

router.post('/ventas', (req,res)=>{
    var fecha_inicial=fechaCorrecta(req.body.fecha_inicial)
    var fecha_final=fechaCorrecta(req.body.fecha_final)
    fecha_final.setDate(fecha_final.getDate()+1)
    connection.query(`SELECT * FROM ventas where fecha BETWEEN '${getFecha(fecha_inicial)} ${getHora(fecha_inicial)}' AND '${getFecha(fecha_final)} ${getHora(fecha_final)}'`, (error, ventas, fields)=>{
        if (error) throw error;
        fecha_final.setDate(fecha_final.getDate()-1)
        res.render('ventas', {
            ventas:ventas,
            fecha_i:cuadrarFecha(fecha_inicial),
            fecha_f:cuadrarFecha(fecha_final)
        })
    });
})
router.get('/vender', (req,res)=>{
    connection.query(`SELECT * FROM productos`, (error, productos, fields)=>{
        if (error) throw error;
        productos=productos.sort(()=> {return Math.random() - 0.5})
        res.render('vender', {productos:productos})
    });
})
router.post('/guardar_venta', (req,res)=>{
    var pedido=JSON.parse(req.body.pedido)
    connection.query(`call INSERTAR_VENTA(${req.body.cliente || '1'})`, (error, ventas, fields)=>{
        if (error) throw error;
        connection.query(`SELECT id FROM ventas ORDER BY ID DESC LIMIT 1`, (error, venta, field)=>{
            console.log(venta[0].id)
            for(var i=0 ;i < pedido.length; i++){
                connection.query(`call INSERTAR_VENDIDOS(${venta[0].id}, ${pedido[i].codigo}, ${pedido[i].cantidad})`,(error, venta, fields)=>{

                })
            }
        })
        res.send('OK')
    });
})

module.exports = router

/**
  var pedido=JSON.parse(req.body.pedido)
    var venta= new Ventas({
        Codigo:Date.now(),
        fecha: new Date(),
        total: req.body.total,
        pedido: pedido
    })

    venta.save((error, listo)=>{
        if(error)
            res.send('E')
        else{
            for(var i=0 ;i < pedido.length; i++){
                var resta= pedido[i].existencia- pedido[i].cantidad
                Producto.findOneAndUpdate({Codigo: pedido[i].codigo},{Existencia: resta},(error, listo)=>{
                
                })
            }
            res.send('OK')
        }
    })


     for(var i=0 ;i < pedido.length; i++){
            console.log(pedido[i])
            connection.query(`INSERT INTO producto_vendido (Producto, Cantidad) values (${pedido[i].codigo}, ${pedido[i].cantidad})`, (error, productos, fields)=>{
                if (error) throw error;
                console.log(productos)
            })
        }
        res.send('OK')
 */