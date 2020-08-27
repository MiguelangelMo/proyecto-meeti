"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eliminar_comentario = exports.agregar_comentario = void 0;

var _Auth = _interopRequireDefault(require("../../models/Auth"));

var _Comentario = _interopRequireDefault(require("../../models/Comentario"));

var _Meeti = _interopRequireDefault(require("../../models/Meeti"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var agregar_comentario = function agregar_comentario(req, res, next) {
  var comentario, comentarios;
  return regeneratorRuntime.async(function agregar_comentario$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          comentario = req.body.comentario;
          comentarios = {};
          comentarios.id = (0, _v["default"])();

          if (comentario) {
            _context.next = 6;
            break;
          }

          res.redirect('back');
          return _context.abrupt("return", next());

        case 6:
          comentarios.comantario = comentario;
          comentarios.authId = req.user.id;
          comentarios.meetiId = req.params.id;
          console.log(comentario);
          _context.next = 12;
          return regeneratorRuntime.awrap(_Comentario["default"].create(comentarios));

        case 12:
          res.redirect('back');
          next();

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.agregar_comentario = agregar_comentario;

var eliminar_comentario = function eliminar_comentario(req, res, next) {
  var comentario, meeti;
  return regeneratorRuntime.async(function eliminar_comentario$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_Comentario["default"].findByPk(req.body.id));

        case 2:
          comentario = _context2.sent;

          if (comentario) {
            _context2.next = 6;
            break;
          }

          res.status(404).send('Operación no valida');
          return _context2.abrupt("return", next());

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(_Meeti["default"].findOne({
            where: {
              id: comentario.meetiId,
              authId: req.user.id
            }
          }));

        case 8:
          meeti = _context2.sent;

          if (!(comentario.authId === req.user.id || meeti)) {
            _context2.next = 22;
            break;
          }

          _context2.prev = 10;
          _context2.next = 13;
          return regeneratorRuntime.awrap(comentario.destroy({
            where: {
              id: comentario.id,
              authId: req.user.id
            }
          }));

        case 13:
          res.send('Se ha eliminado tu mensaje');
          return _context2.abrupt("return", next());

        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](10);
          res.status(401).send('Ha ocurrido un error');

        case 20:
          _context2.next = 24;
          break;

        case 22:
          res.status(403).send('Operación no valida');
          return _context2.abrupt("return", next());

        case 24:
          next();

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[10, 17]]);
};

exports.eliminar_comentario = eliminar_comentario;