var express = require('express');
var app = express();


// Login POST ACTION
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
            message: error_msg
        });
    }
})
// SHOW LIST OF USERS
app.get('/listaUsuarios', function(req, res, next) {

    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM users ORDER BY id DESC', function(err, rows, fields) {
            res.json({
                codigo: '0',
                lista: rows
            });
        })
    })
})


// ADD NEW USER POST ACTION
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
            message: error_msg
        });
    }
})


// EDIT USER POST ACTION
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
            message: error_msg
        });

    }
})

// DELETE USER
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
