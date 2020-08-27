"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.perfil_usuario = void 0;

var _Auth = _interopRequireDefault(require("../../models/Auth"));

var _Grupos = _interopRequireDefault(require("../../models/Grupos"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var perfil_usuario = function perfil_usuario(req, res) {
  var authPromise, gruposPromise, _ref, _ref2, auth, grupos;

  return regeneratorRuntime.async(function perfil_usuario$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          authPromise = _Auth["default"].findByPk(req.params.id);
          gruposPromise = _Grupos["default"].findAll({
            where: {
              authId: req.params.id
            }
          });
          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.all([authPromise, gruposPromise]));

        case 4:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          auth = _ref2[0];
          grupos = _ref2[1];
          res.render('show-usuario', {
            title: "P\xE9rfil - ".concat(auth.nombre),
            auth: auth,
            grupos: grupos
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.perfil_usuario = perfil_usuario;