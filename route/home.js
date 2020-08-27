import express from 'express';
import shorid from 'shortid';
import { index } from '../controllers/homeController';
import {
    crear_cuenta_get,
    crear_cuenta_post,
    iniciar_sesion_get,
    iniciar_sesion_post,
    confirmar_cuenta_get,
    autentificarUser,
    cerrar_sesion_get,
} from '../controllers/authController';
import {
    landing_page_get,
    nuevo_grupo_get,
    nuevo_grupo_post,
    upload,
    subirFoto,
    editar_grupo_get,
    editar_grupo_post,
    editar_imagen_get,
    editar_imagen_post,
    eliminar_grupo,
    nuevo_meeti_get,
    nuevo_meeti_post,
    editar_meeti_get,
    editar_meeti_post,
    eliminar_meeti,
    editar_perfil_get,
    editar_perfil_post,
    editar_password_get,
    editar_password_post,
    editar_imagen_perfil_get,
    editar_imagen_perfil_post,
} from '../controllers/adminController';

import {
    showMeeti,
    asistir,
    verAsistente,
    buscar_meeti,
} from '../controllers/frondEnd/meetiController';

import {
    perfil_usuario,
} from '../controllers/frondEnd/authController';

import {
    mostrar_grupo,
} from '../controllers/frondEnd/gruposController';

import {
    mapeo_x_categoria,
} from '../controllers/frondEnd/categoriaController';

import {
    agregar_comentario,
    eliminar_comentario,
} from '../controllers/frondEnd/comentarioController';

import { check, body } from 'express-validator';

var multer = require('multer')

const route = express.Router();

route.get('/', index);

// Frond-End
route.get('/meeti/:slug', showMeeti);
route.post('/confirmar-asistencia/:slug', autentificarUser, asistir);
route.get('/asistentes/:slug', verAsistente);
route.get('/auths/:id', perfil_usuario);
route.get('/grupos/:id', mostrar_grupo);
route.get('/category/:slug', mapeo_x_categoria);
route.post('/meeti/:id', agregar_comentario);
route.post('/eliminar-comentario', eliminar_comentario);
route.get('/buscador', buscar_meeti);

route.get('/crear-cuenta', crear_cuenta_get);
route.post('/crear-cuenta',
    [
        check('confirmar', 'Campo repetir password es obligatorio').notEmpty().escape(),
        check('password').escape(),
        check('email').escape(),
        check('nombre').escape(),
    ],
    crear_cuenta_post);

route.get('/iniciar-sesion', iniciar_sesion_get);
route.post('/iniciar-sesion', iniciar_sesion_post);

route.get('/cerrar-sesion', autentificarUser, cerrar_sesion_get);

route.get('/confirmar-cuenta/:email', confirmar_cuenta_get);

route.get('/landing-page', autentificarUser, landing_page_get);

route.get('/nuevo-grupo', autentificarUser, nuevo_grupo_get);
route.post('/uffs', autentificarUser, upload,
    [
        check('nombre', 'Por favor, complete el campo nombre').notEmpty().escape(),
        check('descripcion', 'Por favor, complete el campo descripción').notEmpty(),
    ],
    nuevo_grupo_post);

route.post('/nuevo-grupo',
    autentificarUser,
    multer(
        {
            limits: { fileSize: 1000000 },
            storage: multer.diskStorage({
                destination: (res, file, cb) => {
                    cb(null, __dirname + '/../public/uploads/grupos')
                },
                filename: (req, file, cb) => {
                    const extencion = file.mimetype.split('/');
                    const nombreImagen = `${shorid.generate()}.${extencion[1]}`;
                    cb(null, nombreImagen);
                }
            }),
            fileFilter(req, file, cb) {
                if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
                else cb(new Error('Formato no valido'), false);
            }
        }
    ).single('imagen'),
    [
        check('nombre', 'Por favor, complete el campo nombre').notEmpty().escape(),
        check('descripcion', 'Por favor, complete el campo descripción').notEmpty(),
    ],
    nuevo_grupo_post)

route.get('/editar-grupo/:id', autentificarUser, editar_grupo_get);
route.post('/editar-grupo/:id', autentificarUser, editar_grupo_post);

route.get('/editar-imagen/:id', autentificarUser, editar_imagen_get);
route.post('/editar-imagen/:id', autentificarUser, upload, editar_imagen_post);

route.get('/eliminar-grupo/:id', autentificarUser, eliminar_grupo);

route.get('/nuevo-meeti', autentificarUser, nuevo_meeti_get);
route.post('/nuevo-meeti', autentificarUser,
    [
        body('titulo'),
        body('invitado'),
        body('cupo'),
        body('fecha'),
        body('hora'),
        body('direccion'),
        body('estado'),
        body('ciudad'),
        body('pais'),
        body('lat'),
        body('lng'),
    ],
    nuevo_meeti_post);
route.get('/editar-meeti/:id', autentificarUser, editar_meeti_get);
route.post('/editar-meeti/:id', autentificarUser, editar_meeti_post);

route.get('/eliminar-meeti/:id', autentificarUser, eliminar_meeti);

route.get('/editar-perfil', autentificarUser, editar_perfil_get);
route.post('/editar-perfil', autentificarUser,
    [
        body('nombre').notEmpty().trim(),
        body('descripcion').notEmpty().trim(),
        body('email').notEmpty().trim().isEmail(),
    ],
    editar_perfil_post);

route.get('/editar-password', autentificarUser, editar_password_get);
route.post('/editar-password', autentificarUser, editar_password_post);

route.get('/editar-imagen-perfil', autentificarUser, editar_imagen_perfil_get);
route.post('/editar-imagen-perfil', autentificarUser, subirFoto, editar_imagen_perfil_post);

export default route;