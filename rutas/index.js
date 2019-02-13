express = require('express');
router = express.Router();
Producto = require('../modelos/productos')
Ventas = require('../modelos/ventas')

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'db_tienda'
});

connection.connect();

router.post('/guardar-producto', (req, res) => {
    connection.query(`SELECT * FROM productos where Codigo = '${req.body.Codigo}'`, (error, productos, fields) => {
        if (error) throw error;
        if (productos.length > 0) res.send('Error 2')
        else {
            connection.query(`call INSERTAR_PRODUCTO('${req.body.Nombre}', '${req.body.Codigo}', '${req.body.Precio}', '${req.body.Existencia}')`, (error, productos, fields) => {
                res.send('OK')
            })
        }
    });
})



router.get('/todos', (req,res)=>{
    connection.query(`SELECT * FROM productos`, (error, productos, fields) => {
        console.log('Envió')
        console.log(productos)
        res.send(productos)
    })
})

router.post('/eliminacion', (req,res)=>{
    connection.query(`DElETE FROM productos where Nombre = ${req.body.Nombre}`, (error, productos, fields) => {
        console.log('Envió')
        console.log(productos)
        res.send(productos)
    })
})

router.post('/detalles', (req,res)=>{
    connection.query(`SELECT * FROM productos where Nombre = ${req.body.Nombre}`, (error, productos, fields) => {
        console.log('Envió')
        console.log(productos)
        res.send(productos)
    })
})


function aCadena(producto) {
    var nuevProducto = new Array()
    for (var i = 0; i < producto.length; i++) {
        nuevProducto.push({
            Codigo: producto[i].Codigo,
            Nombre: producto[i].Nombre,
            Precio: producto[i].Precio,
            Existencia: producto[i].Existencia + ""
        })
    }
    return nuevProducto
}

router.post('/consultar-producto', (req, res) => {
    connection.query(`SELECT * FROM productos where Codigo = '${req.body.codigo}' LIMIT 1`, (error, productos, fields) => {
        if (error) throw error;
        if (productos.length > 0) res.send(productos[0])
        else res.send('Error 4')
    })
})

router.get('/todos-productos', (req, res) => {
    connection.query(`SELECT * FROM productos LIMIT 1500`, (error, productos, fields) => {
        if (error) throw error;
        productos = productos.sort(() => { return Math.random() - 0.5 });
        res.send(aCadena(productos))
    })
})
router.post('/modificar', (req, res) => {
    connection.query(`SELECT * FROM productos where Codigo = '${req.body.codigo}' LIMIT 1`, (error, productos, fields) => {
        if (error) throw error;
        if (productos.length < 1) res.send('Error 1')
        else {
            connection.query(`call ACTUALIZAR_PRODUCTO( '${req.body.codigo}', '${req.body.nombre}', '${req.body.precio}', '${req.body.existencia}')`, (error, productos, fields) => {
                res.send('OK')
            })
        }
    })
})


router.post('/parametro-busqueda', (req, res) => {
    res.send('Error 4')
});

router.post('/eliminacion', (req, res) => {
    //ELIMINAR_PRODUCTO
    connection.query(`call ELIMINAR_PRODUCTO('${req.body.codigo}')`, (error, ELIMINAR_PRODUCTO, fields) => {
        if (error) throw error;
        res.send('OK')
    })
})
router.post('/guardar-venta', (req, res) => {
    connection.query(`call INSERTAR_VENTA('${req.body.cliente || 1}')`, (error, venta, fields) => {
        if (error) throw error;
        var todosproductos = (req.body.parametro).split('$$$')
        var pedido = new Array();
        for (var i = 0; i < todosproductos.length; i++) {
            var p = todosproductos[i].split(';;')
            pedido.push({ codigo: p[0], nombre: p[1], precio: p[2], existencia: p[3], cantidad: p[4] })
        }
        for (var i = 0; i < pedido.length; i++) {
            connection.query(`call INSERTAR_VENDIDOS('${pedido[i].codigo}', '${pedido[i].cantidad}')`, (error, vendidos, fields) => {
                res.send('OK')
            })
        }
    })
})
router.post('/menor_cantidad', (req, res) => {
    connection.query(`select * from productos where Existencia < ${req.body.parametro}`, (error, productos, fields) => {
        if (error) throw error;
        res.send(aCadena(productos))
    })
})

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

router.post('/reporte_fecha', (req, res) => {
    // var fecha_inicial = new Date(req.body.fecha_inicial)
    // var fecha_final = new Date(req.body.fecha_final)
    // if (fecha_final == 'Invalid Date' || fecha_inicial == 'Invalid Date') {
    //     res.send("Error 7")
    // } else {
    //     fecha_final.setDate(fecha_final.getDate() + 1)
    //     connection.query(`select * from ventas where Fecha Between '${getFecha(fecha_inicial)} ${getHora(fecha_inicial)}' AND '${getFecha(fecha_final)} ${getHora(fecha_final)}'`, (error, ventas, fields) => {
    //         if (error) throw error;
    //         var nuevaVenta = new Array();
    //         for (var i = 0; i < ventas.length; i++) {
    //             var fecha = new Date(ventas[i].Fecha)
    //             nuevaVenta.push({
    //                 Codigo: ventas[i].id,
    //                 fecha: fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear(),
    //                 total: ((ventas[i].total).toFixed(2)).toString(),
    //                 pedido: ventas[i].pedido
    //             })
    //         }
    //         res.send(nuevaVenta)
    //     })
    // }
    res.send([])
})


module.exports = router