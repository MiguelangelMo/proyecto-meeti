"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapeo_x_categoria = void 0;

var _Categoria = _interopRequireDefault(require("../../models/Categoria"));

var _Meeti = _interopRequireDefault(require("../../models/Meeti"));

var _Grupos = _interopRequireDefault(require("../../models/Grupos"));

var _Auth = _interopRequireDefault(require("../../models/Auth"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mapeo_x_categoria = function mapeo_x_categoria(req, res, next) {
  var categoria, meeti;
  return regeneratorRuntime.async(function mapeo_x_categoria$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_Categoria["default"].findOne({
            where: {
              slug: req.params.slug
            },
            attributes: ['id', 'nombre']
          }));

        case 2:
          categoria = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(_Meeti["default"].findAll({
            order: [['fecha', 'ASC'], ['hora', 'ASC']],
            include: [{
              model: _Grupos["default"],
              where: {
                categoriumId: categoria.id
              }
            }, {
              model: _Auth["default"]
            }]
          }));

        case 5:
          meeti = _context.sent;

          if (meeti) {
            _context.next = 9;
            break;
          }

          res.redirect('/');
          return _context.abrupt("return", next());

        case 9:
          res.render('categoria', {
            title: "Categoria: ".concat(categoria.nombre),
            meeti: meeti,
            moment: _moment["default"]
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.mapeo_x_categoria = mapeo_x_categoria;