"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buscar_meeti = exports.verAsistente = exports.asistir = exports.showMeeti = void 0;

var _Meeti = _interopRequireDefault(require("../../models/Meeti"));

var _Grupos = _interopRequireDefault(require("../../models/Grupos"));

var _Comentario = _interopRequireDefault(require("../../models/Comentario"));

var _Auth = _interopRequireDefault(require("../../models/Auth"));

var _sequelize = require("sequelize");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var showMeeti = function showMeeti(req, res, next) {
  var meeti, comentarios;
  return regeneratorRuntime.async(function showMeeti$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_Meeti["default"].findOne({
            where: {
              slug: req.params.slug
            },
            include: [{
              model: _Grupos["default"]
            }, {
              model: _Auth["default"],
              attributes: ['nombre', 'id', 'imagen']
            }]
          }));

        case 2:
          meeti = _context.sent;

          if (meeti) {
            _context.next = 7;
            break;
          }

          req.flash('error', 'Not Found');
          res.redirect('/');
          return _context.abrupt("return", next());

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(_Comentario["default"].findAll({
            where: {
              meetiId: meeti.id
            },
            include: [{
              model: _Auth["default"],
              attributes: ['nombre', 'id', 'imagen']
            }]
          }));

        case 9:
          comentarios = _context.sent;
          res.render('show-meeti', {
            title: meeti.titulo,
            meeti: meeti,
            moment: _moment["default"],
            comentarios: comentarios
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.showMeeti = showMeeti;

var asistir = function asistir(req, res, next) {
  return regeneratorRuntime.async(function asistir$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.body.params.data === 'confirmar') {
            _Meeti["default"].update({
              'interesados': _sequelize.Sequelize.fn('array_append', _sequelize.Sequelize.col('interesados'), req.user.id)
            }, {
              'where': {
                'slug': req.params.slug
              }
            });

            res.status(200).send('Se ha confirmado tu asistencia, te esperamos');
          } else {
            _Meeti["default"].update({
              'interesados': _sequelize.Sequelize.fn('array_remove', _sequelize.Sequelize.col('interesados'), req.user.id)
            }, {
              'where': {
                'slug': req.params.slug
              }
            });

            res.status(200).send('Has removido tu asistencia, ¿Por qué no nos acompaña? sera una gran esperiencia');
          }

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.asistir = asistir;

var verAsistente = function verAsistente(req, res) {
  var meeti, interesados, asistente;
  return regeneratorRuntime.async(function verAsistente$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_Meeti["default"].findOne({
            where: {
              slug: req.params.slug
            },
            attributes: ['interesados']
          }));

        case 2:
          meeti = _context3.sent;
          interesados = meeti.interesados;
          _context3.next = 6;
          return regeneratorRuntime.awrap(_Auth["default"].findAll({
            where: {
              id: interesados
            },
            attributes: ['nombre', 'imagen']
          }));

        case 6:
          asistente = _context3.sent;
          res.render('asistente-meeti', {
            title: 'Asistentes',
            asistente: asistente
          });

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.verAsistente = verAsistente;

var buscar_meeti = function buscar_meeti(req, res) {
  var _req$query, categoria, titulo, ciudad, pais, query, meetis;

  return regeneratorRuntime.async(function buscar_meeti$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query = req.query, categoria = _req$query.categoria, titulo = _req$query.titulo, ciudad = _req$query.ciudad, pais = _req$query.pais;
          if (categoria) query = '';else query = "where: { categoria: { [Op.eq]: categoria } }";
          _context4.next = 4;
          return regeneratorRuntime.awrap(_Meeti["default"].findAll({
            where: {
              titulo: _defineProperty({}, _sequelize.Op.iLike, "%".concat(titulo, "%")),
              ciudad: _defineProperty({}, _sequelize.Op.iLike, "%".concat(ciudad, "%")),
              pais: _defineProperty({}, _sequelize.Op.iLike, "%".concat(pais, "%"))
            },
            include: [{
              model: _Grupos["default"],
              attributes: ['categoria', 'nombre', 'descripcion', 'imagen'],
              query: query
            }, {
              model: _Auth["default"],
              attributes: ['nombre', 'id', 'imagen']
            }]
          }));

        case 4:
          meetis = _context4.sent;
          res.render('buscador', {
            title: 'Resultados',
            meetis: meetis,
            moment: _moment["default"]
          });

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.buscar_meeti = buscar_meeti;