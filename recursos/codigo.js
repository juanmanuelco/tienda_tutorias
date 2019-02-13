var c_pedido = 0

function consultar_producto(event) {
    event.preventDefault()
    codigo = document.getElementById('codigo_barra').value
    codigo = codigo.trim()
    if (codigo.length == 0)
        swal('Error', 'Ingresa un código de barra', 'error')
    else {
        cargando('Obteniendo información')
        envio = { codigo: codigo }
        $.ajax({
            method: "POST",
            url: "/consultar-producto",
            data: envio
        }).done((PRODUCTO) => {
            no_cargando()
            try {
                if (PRODUCTO == 'Error 4') {
                    swal('Error', 'No se han encontrado coincidencias', 'error')
                    return
                }
                asignacion('TXT_nombre_producto', PRODUCTO.Nombre)
                asignacion('TXT_codigo_producto', PRODUCTO.Codigo)
                asignacion('TXT_precio_producto', "$" + (Number(PRODUCTO.Precio)).toFixed(2))
                asignacion('TXT_existencia_producto', 'Quedan ' + PRODUCTO.Existencia + ' en existencia')
                $('#modal-consulta').modal()
            } catch (error) {
                swal('Error', error, 'error')
            }
        })
    }
}


function integrar_producto(event) {
    event.preventDefault()
    cargando('Validando información')
    envio = {
        codigo: obt_valor('TXT_codigo_producto'),
        nombre: obt_valor('TXT_nombre_producto'),
        precio: obt_valor('TXT_precio_producto'),
        existencia: obt_valor('TXT_existencia_producto')
    }
    $.ajax({
        method: "POST",
        url: "/guardar-producto",
        data: envio
    }).done((REGISTRO) => {
        no_cargando()
        try {
            if (REGISTRO != 'OK')
                ERRORES(REGISTRO);
            else
                swal('Listo', 'Se ha registrado el producto con éxito', 'success')
        } catch (error) {
            swal('Error', error, 'error')
        }
        document.getElementById('form_integrar').reset();
    })
}

function modificar(id) {
    envio = { Codigo: id }
    cargando('Obteniendo datos')
    $.ajax({
        method: "POST",
        url: "/web/obtener-producto",
        data: envio
    }).done((PRODUCTO) => {
        no_cargando()
        asignar('TXT_codigo_productos', PRODUCTO.Codigo)
        asignar('TXT_nombre_productos', PRODUCTO.Nombre)
        asignar('TXT_precio_productos', Number(PRODUCTO.Precio).toFixed(2))
        asignar('TXT_existencia_productos', PRODUCTO.Existencia)
        $('#modal_modificar').modal()
    })
}
function modificar_producto(event) {
    cargando()
    event.preventDefault();
    envio = {
        codigo: obt_valor('TXT_codigo_productos'),
        nombre: obt_valor('TXT_nombre_productos'),
        precio: obt_valor('TXT_precio_productos'),
        existencia: obt_valor('TXT_existencia_productos')
    }
    $.ajax({
        method: "POST",
        url: "/modificar",
        data: envio
    }).done((ACTUALIZADO) => {
        no_cargando()
        if (ACTUALIZADO != 'OK')
            ERRORES(ACTUALIZADO)
        else {
            $('#modal_modificar').modal('hide')
            swal('Listo', 'Se ha actualizado el producto con éxito', 'success', { allowOutsideClick: false }).then((click) => {
                location.reload()
            })
        }
    })
}
function eliminar(identidad) {
    swal({
        title: '¿Está segur@?',
        text: 'Una vez eliminado no se podrá recuperar',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'No, no eliminar'
    }).then((result) => {
        envio = { codigo: identidad }
        cargando('Eliminando...')
        $.ajax({
            method: "POST",
            url: "/eliminacion",
            data: envio
        }).done((ELIMINADO) => {
            no_cargando()
            if (ELIMINADO != 'OK')
                ERRORES(ELIMINADO)
            else
                swal('Listo', 'Se ha eliminado el producto con éxito', 'success').then((click) => { location.reload() })
        })
    })
}
function filtro_existencia() {
    resultados = 0
    filtro = (document.getElementById('filtro-buscar').value)
    fila = document.getElementsByClassName('registro_producto')
    for (var i = 0; i < fila.length; i++) {
        columna = fila[i].getElementsByClassName('detalle_producto')
        if (Number((columna[0].innerHTML).trim()) <= filtro) {
            fila[i].style.display = ''
            resultados++
        }
        else
            fila[i].style.display = 'none'
    }
    document.getElementById('lb_resultados').innerText = resultados + ' resultados.'
}
function obtenerSubTotales() {
    precios = document.getElementsByClassName('precios')
    cantidades = document.getElementsByClassName('cantidades')
    subtotales = document.getElementsByClassName('subtotales')
    for (var i = 0; i < subtotales.length; i++) {
        subtotales[i].innerHTML = Number((precios[i].innerHTML) * (cantidades[i].innerHTML)).toFixed(2)
    }
    totales = document.getElementsByClassName('totales')
    var final = 0
    for (var i = 0; i < totales.length; i++) {
        final += Number(totales[i].innerHTML)
    }
    document.getElementById('lb_resultados').innerHTML = totales.length + " ventas realizadas"
    document.getElementById('lb_totales').innerHTML = "$" + final.toFixed(2) + " en ingreso por ventas"

}

function detallar_venta(id) {
    envio = { Codigo: id }
    cargando('Obteniendo datos')
    $.ajax({
        method: "POST",
        url: "/web/obtener-producto",
        data: envio
    }).done((PRODUCTO) => {
        no_cargando()
        document.getElementById('codigo_p').innerHTML = PRODUCTO.Codigo;
        document.getElementById('nombre_p').innerHTML = PRODUCTO.Nombre
        document.getElementById('precio_p').innerHTML = "$ <b id='prec_p'>" + Number(PRODUCTO.Precio).toFixed(2) + "</b>"
        document.getElementById('existencia_p').innerHTML = PRODUCTO.Existencia
        document.getElementById('cantidad_pedir').setAttribute('max', PRODUCTO.Existencia)
        $('#escogerVenta').modal()
        c_pedido = PRODUCTO.Existencia
    })

}
function control_cantidad() {
    cantidad = document.getElementById('cantidad_pedir').value
    if (cantidad > c_pedido)
        document.getElementById('cantidad_pedir').value = 0
}

function anadir() {
    if (obt_valor('cantidad_pedir') == 0) {
        swal('Error', 'No puedes vender 0 productos', 'error')
    } else {
        var carrito = localStorage.getItem('carrito')
        if (carrito == null)
            carrito = new Array()
        else 
            carrito = JSON.parse(carrito)
        var codigo=obt_inner('codigo_p')
        var bandera=true
        for(var i=0; i < carrito.length;i++){
            if(carrito[i].codigo==codigo)
                bandera=false
        }
        $('#escogerVenta').modal('hide')
        if(bandera){
            carrito.push(add_elemento())
            document.getElementById('cantidad_pedir').value=0
            localStorage.setItem('carrito', JSON.stringify(carrito))
            mostrarCarrito()
        }else{
            document.getElementById('cantidad_pedir').value=0
            swal('Error', 'No se puede escoger dos veces el mismo artículo', 'error')
        }  
    }

}
function add_elemento() {
    var elem = {
        codigo: obt_inner('codigo_p'),
        nombre: obt_inner('nombre_p'),
        precio: obt_inner('prec_p'),
        existencia: obt_inner('existencia_p'),
        cantidad: obt_valor('cantidad_pedir')
    }
    return elem
}
function mostrarCarrito() {
    var carrito = localStorage['carrito']
    carrito = JSON.parse(carrito)
    var total=0
    if (carrito != null) {
        var encabezado = `<tr>
        <th style="width:50%">Nombre</th>
        <th style="width:10%">Precio</th>
        <th style="width:10%">Cantidad</th>
        <th style="width:10%">Subt</th>
        <th style="width:20%" class="elim_imp">Acciones</th>
                    </tr>`
        for (var i = 0; i < carrito.length; i++) {
            var sub=(Number(carrito[i].precio) * Number(carrito[i].cantidad)).toFixed(2)
            total+=Number(sub)
            encabezado += `<tr>
                            <td >*${carrito[i].nombre}</td>
                            <td class="medio">$${carrito[i].precio}</td>
                            <td class="medio">${carrito[i].cantidad}</td>
                            <td class="medio">$${sub}</td>
                            <td class="elim_imp">
                            <button onclick="mod_carrito(${i})" type="button" class="btn btn-primary" aria-label="Left Align">
                                <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                            </button>
                            <button onclick="eliminar_articulo(${i})" type="button" class="btn btn-danger" aria-label="Left Align">
                                <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                            </button></td>
                        </tr>`
        }
        document.getElementById('tabla_carrito').innerHTML = encabezado
        document.getElementById('tot_pag_ven').innerHTML=total.toFixed(2)
    }

}

function borrar_carrito() {
    localStorage.removeItem('carrito')
    
    swal('Listo', 'Carrito eliminado con éxito', 'success')
    document.getElementById('tabla_carrito').innerHTML = `<tr>
                                                            <th style="width:50%">Nombre</th>
                                                            <th style="width:10%">Precio</th>
                                                            <th style="width:10%">Cantidad</th>
                                                            <th style="width:10%">Subtotal</th>
                                                            <th style="width:20%">Acciones</th>
                                                        </tr>`
    mostrarCarrito()
}
 function mod_carrito(i){
    var carrito= localStorage.getItem('carrito')
    carrito=JSON.parse(carrito)
    var fila = carrito[i]
    document.getElementById('codigo_pv').innerHTML = fila.codigo;
    document.getElementById('nombre_pv').innerHTML = fila.nombre
    document.getElementById('precio_pv').innerHTML = "$ <b id='prec_p'>" + Number(fila.precio).toFixed(2) + "</b>"
    document.getElementById('existencia_pv').innerHTML = fila.existencia

    document.getElementById('cantidad_pedirv').setAttribute('max', fila.existencia)
    document.getElementById('cantidad_pedirv').value=fila.cantidad
     $('#modificar_venta').modal()
 }

 function modificar_articulo(){
    var codigo=obt_inner('codigo_pv')
    var cantidad= obt_valor('cantidad_pedirv')
    var existencia= obt_inner('existencia_pv')
    if(cantidad <=0 || cantidad>existencia)
        swal('Error', 'nose puede vender esa cantidad', 'error')
    else{
        var carrito=localStorage.getItem('carrito')
        carrito=JSON.parse(carrito)
        for(var i=0; i < carrito.length; i++){
            if(codigo==carrito[i].codigo)
                carrito[i].cantidad=cantidad
        }
        localStorage.setItem('carrito', JSON.stringify(carrito))
        $('#modificar_venta').modal('hide')
        mostrarCarrito()
    }
 }
function eliminar_articulo(pos){
    var carrito=localStorage.getItem('carrito')
    carrito=JSON.parse(carrito)
    carrito.splice(pos,1)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    mostrarCarrito()
}
function fin_venta(decision){

    if(decision){
        guardarVenta()
    }else{
        document.getElementById('pago_c').innerHTML='Comprobante de pago'
        guardarVenta()
        imprimir('impresion_factura')
    }
}
function guardarVenta(){
    envio = { pedido: (localStorage.getItem('carrito')), total: document.getElementById('tot_pag_ven').innerHTML }
    cargando('Guardando datos')
    $.ajax({
        method: "POST",
        url: "/web/guardar_venta",
        data: envio
    }).done((Listo) => {
        $('#fin_venta').modal('hide')
        no_cargando()
        localStorage.removeItem('carrito')
        swal('Listo', 'Venta registrada con éxito', 'success')
        document.getElementById('tabla_carrito').innerHTML = `<tr>
                                                            <th style="width:50%">Nombre</th>
                                                            <th style="width:10%">Precio</th>
                                                            <th style="width:10%">Cantidad</th>
                                                            <th style="width:10%">Subtotal</th>
                                                            <th style="width:20%">Acciones</th>
                                                        </tr>`
        document.getElementById('tot_pag_ven').innerHTML=0.00
        document.getElementById('oculto_factura').style.display='none'
        document.getElementById('botones_factura').style.display='block'
        document.getElementById('Banner').innerHTML='Carrito de compras'
        location.reload()
       
    })
    
}
function cotizar(){
    document.getElementById('pago_c').innerHTML='Cotización'
    imprimir('impresion_factura')
    document.getElementById('oculto_factura').style.display='none'
    document.getElementById('botones_factura').style.display='block'
    document.getElementById('Banner').innerHTML='Carrito de compras'
    document.getElementById('pago_c').innerHTML='Comprobante de pago'
    mostrarCarrito()
}
