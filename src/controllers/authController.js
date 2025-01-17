const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const conexion = require('../database/db.js');
const bcrypt = require('bcrypt');
const { promisify } = require('util')
const randtoken = require('rand-token');
const { my_domain } = require("../keys").config

// todo: LOGIN
exports.login = async (req, res) => {
    try {
        const correo = req.body.correo
        const pass = req.body.pass

        if (!correo || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: "Oops",
                alertMessage: "Ingrese un usuario y contraseña",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            await conexion.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {

                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Contraseñas incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                } else{

                        //inicio de sesión OK
                        const id = results[0].id_consecutivo
                        const token = jwt.sign({ id: id }, 'super_secret_AppSigmaWater')

                        const cookiesOptions = {
                            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                            httpOnly: true
                        }
                        res.cookie('jwt', token, cookiesOptions)

                        let options = {
                            alert: true,
                            alertTitle: "¡Bienvenido!",
                            alertMessage: "",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 1200,
                            ruta: './'
                        }

                        // if (results[0].rol === "administrador") {
                        //     options.ruta = 'administrador'
                        // }
                        res.render('login', options)
                }
            })

        }
    } catch (error) {
        console.log(error)
    }
}
// todo: AUTENTICACION
exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret_AppSigmaWater');
            conexion.query('SELECT u.*, r.total_ventas, r.nombres, r.apellidos FROM usuarios u LEFT JOIN registro_de_vendedores r ON r.id = u.id_consecutivo WHERE u.id_consecutivo = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                // req.user = results[0]
                // if (results[0].foto) {
                //     req.user.foto = results[0].foto
                // } else {
                //     req.user.foto = "../directorio_dash/images/users/userDefault.gif"
                // }

                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login')
    }
}

// todo: LOGOUT
exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

// todo: VALIDACION CUANDO YA INICIA SESION
exports.nologueado = async (req, res, next) => {
    if (!req.cookies.jwt) {
        return next()
    } else {
        res.redirect('/')
    }
}


// exports.isSeller = async (req, res, next) => {
//     try {
//         if (!(req.user.rol === "vendedor")) {
//             res.redirect("/login");
//         }
//     } catch (error) {
//         console.log(error);
//         return next();
//     }
// };