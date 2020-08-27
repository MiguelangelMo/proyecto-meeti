"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mostrar_grupo = void 0;

var _Grupos = _interopRequireDefault(require("../../models/Grupos"));

var _Meeti = _interopRequireDefault(require("../../models/Meeti"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var mostrar_grupo = function mostrar_grupo(req, res, next) {
  var gruposPromise, meetiPromise, _ref, _ref2, grupo, meeti;

  return regeneratorRuntime.async(function mostrar_grupo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          gruposPromise = _Grupos["default"].findByPk(req.params.id);
          meetiPromise = _Meeti["default"].findAll({
            where: {
              grupoId: req.params.id
            },
            order: [['fecha', 'ASC']]
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.all([gruposPromise, meetiPromise]));

        case 4:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          grupo = _ref2[0];
          meeti = _ref2[1];

          if (grupo) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", next());

        case 10:
          res.render('show-grupos', {
            title: "".concat(grupo.nombre),
            grupo: grupo,
            meeti: meeti,
            moment: _moment["default"]
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.mostrar_grupo = mostrar_grupo;