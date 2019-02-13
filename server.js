//Establecemos la crecaión del servidor de elementos__________________________________________________________________________________________
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
express = require('express'),
exphbs = require('express-handlebars'),
flash = require('connect-flash'),
path = require('path'),
servidor = express();
var puerto=80;
var http = require('http').Server(servidor),
port = process.env.PORT || puerto;

//Establecemos las rutas para cada uso
rutaIndex = require('./rutas/index')
rutaweb= require('./rutas/web')

//Definimos que se usará tecnología hbs para modificar la vista de una página
servidor.set('views', path.join(__dirname, 'views'));

//La página estática sirve para reciclar elementos
servidor.engine('handlebars', exphbs({ defaultLayout: 'estatico' }));
servidor.set('view engine', 'handlebars');

//Aqui se define donde estarán los estilos y scripts tanto globales como modulares
servidor.use(express.static(path.join(__dirname, 'recursos')));


//Permitimos el reconocimiento de JSON en el sistema 
    servidor.use(bodyParser.json());
    servidor.use(bodyParser.urlencoded({ extended: false }));
    servidor.use(cookieParser());

//usamos las rutas creadas anteriormente
    servidor.use('/', rutaIndex)
    servidor.use('/web', rutaweb)

//Controlamos el error de página no encontrada
servidor.use((req, res) => { res.send('Error 400')});

//Controlamos el error de fallos en el servidor
servidor.use((err, req, res, next) => { console.log(err);res.send('Error 500')})

//Inicializamos el servidor
http.listen(port);
