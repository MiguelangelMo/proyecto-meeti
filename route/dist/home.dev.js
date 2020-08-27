"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _shortid = _interopRequireDefault(require("shortid"));

var _homeController = require("../controllers/homeController");

var _authController = require("../controllers/authController");

var _adminController = require("../controllers/adminController");

var _meetiController = require("../controllers/frondEnd/meetiController");

var _authController2 = require("../controllers/frondEnd/authController");

var _gruposController = require("../controllers/frondEnd/gruposController");

var _categoriaController = require("../controllers/frondEnd/categoriaController");

var _comentarioController = require("../controllers/frondEnd/comentarioController");

var _expressValidator = require("express-validator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var multer = require('multer');

var route = _express["default"].Router();

route.get('/', _homeController.index); // Frond-End

route.get('/meeti/:slug', _meetiController.showMeeti);
route.post('/confirmar-asistencia/:slug', _authController.autentificarUser, _meetiController.asistir);
route.get('/asistentes/:slug', _meetiController.verAsistente);
route.get('/auths/:id', _authController2.perfil_usuario);
route.get('/grupos/:id', _gruposController.mostrar_grupo);
route.get('/category/:slug', _categoriaController.mapeo_x_categoria);
route.post('/meeti/:id', _comentarioController.agregar_comentario);
route.post('/eliminar-comentario', _comentarioController.eliminar_comentario);
route.get('/buscador', _meetiController.buscar_meeti);
route.get('/crear-cuenta', _authController.crear_cuenta_get);
route.post('/crear-cuenta', [(0, _expressValidator.check)('confirmar', 'Campo repetir password es obligatorio').notEmpty().escape(), (0, _expressValidator.check)('password').escape(), (0, _expressValidator.check)('email').escape(), (0, _expressValidator.check)('nombre').escape()], _authController.crear_cuenta_post);
route.get('/iniciar-sesion', _authController.iniciar_sesion_get);
route.post('/iniciar-sesion', _authController.iniciar_sesion_post);
route.get('/cerrar-sesion', _authController.autentificarUser, _authController.cerrar_sesion_get);
route.get('/confirmar-cuenta/:email', _authController.confirmar_cuenta_get);
route.get('/landing-page', _authController.autentificarUser, _adminController.landing_page_get);
route.get('/nuevo-grupo', _authController.autentificarUser, _adminController.nuevo_grupo_get);
route.post('/uffs', _authController.autentificarUser, _adminController.upload, [(0, _expressValidator.check)('nombre', 'Por favor, complete el campo nombre').notEmpty().escape(), (0, _expressValidator.check)('descripcion', 'Por favor, complete el campo descripción').notEmpty()], _adminController.nuevo_grupo_post);
route.post('/nuevo-grupo', _authController.autentificarUser, multer({
  limits: {
    fileSize: 1000000
  },
  storage: multer.diskStorage({
    destination: function destination(res, file, cb) {
      cb(null, __dirname + '/../public/uploads/grupos');
    },
    filename: function filename(req, file, cb) {
      var extencion = file.mimetype.split('/');
      var nombreImagen = "".concat(_shortid["default"].generate(), ".").concat(extencion[1]);
      cb(null, nombreImagen);
    }
  }),
  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);else cb(new Error('Formato no valido'), false);
  }
}).single('imagen'), [(0, _expressValidator.check)('nombre', 'Por favor, complete el campo nombre').notEmpty().escape(), (0, _expressValidator.check)('descripcion', 'Por favor, complete el campo descripción').notEmpty()], _adminController.nuevo_grupo_post);
route.get('/editar-grupo/:id', _authController.autentificarUser, _adminController.editar_grupo_get);
route.post('/editar-grupo/:id', _authController.autentificarUser, _adminController.editar_grupo_post);
route.get('/editar-imagen/:id', _authController.autentificarUser, _adminController.editar_imagen_get);
route.post('/editar-imagen/:id', _authController.autentificarUser, _adminController.upload, _adminController.editar_imagen_post);
route.get('/eliminar-grupo/:id', _authController.autentificarUser, _adminController.eliminar_grupo);
route.get('/nuevo-meeti', _authController.autentificarUser, _adminController.nuevo_meeti_get);
route.post('/nuevo-meeti', _authController.autentificarUser, [(0, _expressValidator.body)('titulo'), (0, _expressValidator.body)('invitado'), (0, _expressValidator.body)('cupo'), (0, _expressValidator.body)('fecha'), (0, _expressValidator.body)('hora'), (0, _expressValidator.body)('direccion'), (0, _expressValidator.body)('estado'), (0, _expressValidator.body)('ciudad'), (0, _expressValidator.body)('pais'), (0, _expressValidator.body)('lat'), (0, _expressValidator.body)('lng')], _adminController.nuevo_meeti_post);
route.get('/editar-meeti/:id', _authController.autentificarUser, _adminController.editar_meeti_get);
route.post('/editar-meeti/:id', _authController.autentificarUser, _adminController.editar_meeti_post);
route.get('/eliminar-meeti/:id', _authController.autentificarUser, _adminController.eliminar_meeti);
route.get('/editar-perfil', _authController.autentificarUser, _adminController.editar_perfil_get);
route.post('/editar-perfil', _authController.autentificarUser, [(0, _expressValidator.body)('nombre').notEmpty().trim(), (0, _expressValidator.body)('descripcion').notEmpty().trim(), (0, _expressValidator.body)('email').notEmpty().trim().isEmail()], _adminController.editar_perfil_post);
route.get('/editar-password', _authController.autentificarUser, _adminController.editar_password_get);
route.post('/editar-password', _authController.autentificarUser, _adminController.editar_password_post);
route.get('/editar-imagen-perfil', _authController.autentificarUser, _adminController.editar_imagen_perfil_get);
route.post('/editar-imagen-perfil', _authController.autentificarUser, _adminController.subirFoto, _adminController.editar_imagen_perfil_post);
var _default = route;
exports["default"] = _default;