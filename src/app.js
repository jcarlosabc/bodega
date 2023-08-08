const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const dotenv = require('dotenv')
const morgan = require('morgan'); // registra las solicitudes junto con alguna otra información
const {port} = require('./keys')

const app = express();
 
 app.use(session({ 
    secret: '123458cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))
 
//seteamos el motor de plantillas
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('trust proxy', 1) // Proxy de confianzaf

/** Middlewares */
app.use(morgan('dev'));
app.use(flash());

//para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//seteamos la carpeta public para archivos estáticos
app.use(express.static(path.join(__dirname, './public')));

//seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

//para poder trabajar con las cookies
 app.use(cookieParser());

global.btn_mydomain = 'http://localhost:' + port

// No almacenar caché
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

//llamar al router
app.use('/', require('./routes/router'));

// Configuraciones
app.set('port' , port);

app.listen(app.get('port'), () => {
  console.log("***********************************************************")
  console.log('===> 🚀 SERVIDOR CORRIENDO en http://localhost:' + app.get('port')) 
});

module.exports = app;