function asignacion(elemento, valor){
    document.getElementById(elemento).innerHTML=valor
}
function asignar(elemento, valor){
    document.getElementById(elemento).value=valor
}
function cargando(texto){
    swal({
        title:'Cargando...',
        text: texto ||'No tomará mucho tiempo',
        allowOutsideClick: false, 
        onOpen:()=>{swal.showLoading()},      
    })
}
function soloNumeros(e){
	var key = e.keyCode || e.which;
	var teclado=String.fromCharCode(key);
	var letras="1234567890.";
	especiales="8-37-38-46-164-191";
	var teclado_especial=false;
	for (var i in especiales) {if (key==especiales[i]) {teclado_especial=true;break;}}
	if (letras.indexOf(teclado)==-1 && !teclado_especial) {return false;}
}
//Quita el mensaje de cargando
function no_cargando(){
    swal.close()
}

function obt_valor(elemento){
    return document.getElementById(elemento).value
}
function obt_inner(elemento){
    return document.getElementById(elemento).innerHTML
}

function ERRORES(e){
    var mensaje=''
    if(e=='Error 1')
        mensaje='Error de red'
    if(e=='Error 2')
        mensaje='Este producto ya existe'       
    if(e=='Error 3')
        mensaje='No se ha podido realizar la acción, intente nuevamente'       
    if(e=='Error 4')
        mensaje='No se han encontrado coincidencias'   
    swal('Error', mensaje, 'error')
}
function activar(identidad){
    document.getElementById(identidad).classList.add('active')
}

function filtro_productos() {
    resultados=0
    filtro = (document.getElementById('filtro-buscar').value).toUpperCase()
    fila = document.getElementsByClassName('registro_producto')
    for(var i=0; i < fila.length; i++){
        var muestra=false
        elementos=fila[i].getElementsByClassName('detalle_producto')
        for(var j=0; j< elementos.length; j++){
            if (elementos[j].innerHTML.toUpperCase().indexOf(filtro) > -1)
                muestra=true
        }
        if(muestra){
            fila[i].style.display = ""
            resultados++
        }else
            fila[i].style.display = "none" 
    }
    document.getElementById('lb_resultados').innerText=resultados+' resultados.'
}

function obtenerFechas(){
    fechas=document.getElementsByClassName('fechas')
    for(var i=0; i < fechas.length; i++){
        var nuevaFecha= new Date(fechas[i].innerHTML)
        fechas[i].innerHTML=nuevaFecha.toDateString()+ obtenerHoras(nuevaFecha)
    }
}
function obtenerHoras(nuevaFecha){
    hora=nuevaFecha.getHours()
    minuto=nuevaFecha.getMinutes()
    if(hora<10) hora="0"+hora
    if(minuto<10) minuto="0"+minuto
    return (" "+hora+":"+minuto)
}
function obtenerTotales(){
    totales=document.getElementsByClassName('totales')
    for(var i=0; i< totales.length; i++){
        totales[i].innerHTML=(Number(totales[i].innerHTML)).toFixed(2)
    }
}
function filtro_vender(){
    resultados=0
    filtro = (document.getElementById('filtro-buscar').value).toUpperCase()
    fila = document.getElementsByClassName('registro_producto')
    for(var i=0; i < fila.length; i++){
        var muestra=false
        elementos=fila[i].getElementsByClassName('detalle_producto')
        for(var j=0; j< elementos.length; j++){
            if (elementos[j].innerHTML.toUpperCase().indexOf(filtro) > -1)
                muestra=true
        }
        if(muestra){
            fila[i].style.display = ""
            resultados++
        }else
            fila[i].style.display = "none" 
    }
}


function descargarExcel(tabla){
    var codigos=document.getElementsByClassName('cod_prod_v1')
    for(var i=0; i< codigos.length; i++){
        codigos[i].innerHTML='C'+codigos[i].innerHTML
    }
     var navegador = navigator.userAgent;
        if (navigator.userAgent.indexOf('MSIE') !=-1) {
            alert('Está usando Internet Explorer, no hay compatibilidad');
        } else if (navigator.userAgent.indexOf('Firefox') !=-1) {
            ExportToExcel(tabla);
        } else if (navigator.userAgent.indexOf('Chrome') !=-1) {
            excel(tabla);
        } else if (navigator.userAgent.indexOf('Opera') !=-1) {
            alert('Está usando Opera, no hay compatibilidad');
        } else {
            alert('Está usando un navegador no identificado no hay compatibilidad');
        }
        location.reload()
    }
function excel(tabla){
    var fecha=new Date();
        var tmpElemento = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';
        var tabla_div = tabla;
        var tabla_html = tabla_div.outerHTML.replace(/ /g, '%20');
        tmpElemento.href = data_type + ', ' + tabla_html;
        tmpElemento.download = 'Consulta-'+fecha+'.xls';
        tmpElemento.click();
    }
function ExportToExcel(tabla){
    var htmltable= tabla
    var html = htmltable.outerHTML;
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent(html));
}
function imprimir(elemento){
    var acciones=document.getElementsByClassName('elim_imp')
    for(var i=0; i < acciones.length; i++){
        acciones[i].style.display='none'
    }
    var medios=document.getElementsByClassName('medio')
    for(var i=0; i < medios.length; i++){
        medios[i].style.textAlign = "center";
    }
    document.getElementById('Banner').innerHTML='LA ESQUINA DEL PAISA'
    var nuevaFecha= new Date()
    document.getElementById('fecha_vendida').innerHTML=nuevaFecha.toDateString()
    document.getElementById('oculto_factura').style.display='block'
    document.getElementById('botones_factura').style.display='none'
    var ficha=document.getElementById(elemento);
	var ventimp=window.open(' ','popimpr');
    ventimp.document.write(ficha.innerHTML);
    var estilo= ventimp.document.createElement("link");
    estilo.setAttribute("href", "/estilos.css");
	estilo.setAttribute("rel", "stylesheet");
	estilo.setAttribute("type", "text/css");
	var css = ventimp.document.createElement("link");
	css.setAttribute("href", "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");
	css.setAttribute("rel", "stylesheet");
	css.setAttribute("type", "text/css");
	css.setAttribute("integrity","sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u");
    css.setAttribute('crossorigin',"anonymous");
    ventimp.document.head.appendChild(estilo);
    ventimp.document.head.appendChild(css);	
    	
	ventimp.document.close();
	ventimp.print();
    ventimp.close();
}
