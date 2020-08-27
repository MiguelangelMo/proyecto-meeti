"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = void 0;

var _Categoria = _interopRequireDefault(require("../models/Categoria"));

var _Grupos = _interopRequireDefault(require("../models/Grupos"));

var _Meeti = _interopRequireDefault(require("../models/Meeti"));

var _moment = _interopRequireDefault(require("moment"));

var _sequelize = require("sequelize");

var _Auth = _interopRequireDefault(require("../models/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var index = function index(req, res) {
  var fechaActual, categoriaPromise, meetiPromise, _ref, _ref2, categoria, meeti;

  return regeneratorRuntime.async(function index$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fechaActual = (0, _moment["default"])(new Date()).format('YYYY-MM-DD');
          categoriaPromise = _Categoria["default"].findAll();
          meetiPromise = _Meeti["default"].findAll({
            limit: 3,
            attributes: ['slug', 'titulo', 'fecha', 'hora'],
            where: {
              fecha: _defineProperty({}, _sequelize.Op.gte, fechaActual)
            },
            order: [['fecha', 'ASC']],
            include: [{
              model: _Grupos["default"],
              attributes: ['imagen']
            }, {
              model: _Auth["default"],
              attributes: ['nombre', 'imagen']
            }]
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(Promise.all([categoriaPromise, meetiPromise
          /*, gruposPromise*/
          ]));

        case 5:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          categoria = _ref2[0];
          meeti
          /*, grupos , meet*/
          = _ref2[1];
          res.render('home', {
            title: 'Inicio',
            categoria: categoria,
            meeti: meeti,
            moment: _moment["default"] //meet,

          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.index = index;