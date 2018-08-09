var express = require('express');
var multer  = require('multer')
var app = express();



//Destino y Servicio para cargar imagenes y archivos.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imagenes/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({ storage: storage }).single('profileImage');

  app.post('/profile', function (req, res) {
      upload(req, res, function (err) {
          if (err) {
              // An error occurred when uploading
          }
          res.json({
              message: 'Imagen cargada correctamente.',
              codigo: '0'
          });

          // Everything went fine
      })
  });



//Servicio para login.
app.post('/loginUsuario', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    req.assert('email', 'Se requiere un e-mail o válido.').isEmail(); //Validate email
    req.assert('password', 'Contraseña es requerida').notEmpty(); //Validate password

    var errors = req.validationErrors();

    if (!errors) { //No errors were found.  Passed Validation!
        req.getConnection(function(error, conn) {
            conn.query('SELECT * FROM users WHERE email = ?', [email], function(err, rows, result) {
                if (rows.length > 0) {
                    if (rows[0].password == password) {
                        res.json({
                            message: 'sesión iniciada correctamente',
                            codigo: '0'
                        });
                    } else {
                        res.json({
                            message: 'Correo o Contraseña incorrecta.',
                            codigo: '1'
                        });
                    }
                } else {
                    res.json({
                        message: 'Correo o Contraseña incorrecta.',
                        codigo: '1'
                    });
                }
            })
        })
    } else { //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + ' , '
        })
        res.json({
            message: error_msg,
            codigo: '1'
        });
    }
})
// Lista Usuarios
app.get('/listaUsuarios', function(req, res, next) {

    req.getConnection(function(error, conn) {
        conn.query('SELECT id, name, age, email FROM users', function(err, rows, fields) {
            res.json({
                codigo: '0',
                lista: rows
            });
        })
    })
})

//Lista Clientes
app.get('/listaClientes', function(req, res, next) {

    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM clientes', function(err, rows, fields) {
            res.json({
                codigo: '0',
                lista: rows
            });
        })
    })
})


//Servicio pra crear nuevo usuario.
app.post('/agregarUsuarios', function(req, res, next) {
    req.assert('name', 'Nombre es requerido').notEmpty(); //Validate name
    req.assert('age', 'Edad es requerida').notEmpty(); //Validate age
    req.assert('email', 'Se requiere un e-mail o válido.').isEmail(); //Validate email
		req.assert('password', 'Contraseña es requerida').notEmpty(); //Validate password

    var errors = req.validationErrors()

    if (!errors) { //No errors were found.  Passed Validation!

        var user = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim(),
						password: req.sanitize('password').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    res.json({
                        message: 'Error al crear usuario.',
                        codigo: '1'
                    });
                } else {
                    res.json({
                        message: 'Usuario creado con éxito.',
                        codigo: '0'
                    });
                }
            })
        })
    } else { //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + ' , '
        })
        res.json({
            message: error_msg,
            codigo: '1'
        });
    }
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'imagenes/')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

var upload = multer({storage: storage});

//Servicio pra crear nuevo cliente.
app.post('/agregarClientes',  upload.single('image'), (req, res, next) => {
    req.assert('name', 'Nombre es requerido').notEmpty(); //Validate name
    req.assert('descrip', 'Descripción es requerida').notEmpty(); //Validate age
    req.assert('UrlWeb', 'Se requiere una Url Web.').notEmpty(); //Validate email

    var errors = req.validationErrors()

    if (!errors) { //No errors were found.  Passed Validation!


        var user = {
            name: req.sanitize('name').escape().trim(),
            descrip: req.sanitize('descrip').escape().trim(),
            UrlWeb: req.sanitize('UrlWeb').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO clientes SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    res.json({
                        message: 'Error al crear cliente.',
                        codigo: '1'
                    });
                } else {
                    res.json({
                        message: 'Cliente creado con éxito.',
                        codigo: '0'
                    });
                }
            })
        })
    } else { //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + ' , '
        })
        res.json({
            message: error_msg,
            codigo: '1'
        });
    }
})


//Servicio para editar usuarios
app.put('/editarUsuarios', function(req, res, next) {
    req.assert('name', 'Nombre es requerido').notEmpty() //Validate name
    req.assert('age', 'Edad es requerida').notEmpty() //Validate age
    req.assert('email', 'Se requiere un correo o válido.').isEmail() //Validate email

    var errors = req.validationErrors()

    if (!errors) { //No errors were found.  Passed Validation!
        var user = {
            name: req.sanitize('name').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            email: req.sanitize('email').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE id = ' + req.body.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    res.json({
                        message: 'Error al modificar usuario.',
                        codigo: '1'
                    });
                } else {
                    res.json({
                        message: 'Usuario modificado con éxito.',
                        codigo: '0'
                    });
                }
            })
        })
    } else { //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + ' , '
        })
        res.json({
            message: error_msg,
            codigo: '1'
        });

    }
})

//Servicio para eliminar usuarios.
app.delete('/eliminarUsuarios', function(req, res, next) {
    var user = {
        id: req.body.id
    }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM users WHERE id = ' + req.body.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                res.json({
                    message: "Error ala eliminar al usuario.",
                    codigo: '1'
                });
            } else {
                res.json({
                    message: "El Usuario se elimino correctamente.",
                    codigo: '0'
                });
            }
        })
    })
})

module.exports = app
