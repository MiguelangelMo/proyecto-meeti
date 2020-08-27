"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _db = _interopRequireDefault(require("../config/db"));

var _Auth = _interopRequireDefault(require("./Auth"));

var _Meeti = _interopRequireDefault(require("./Meeti"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Comentarios = _db["default"].define('comentarios', {
  id: {
    type: _sequelize.Sequelize.UUID,
    primaryKey: true
  },
  comantario: _sequelize.Sequelize.STRING(255)
}, {
  timestamps: false
});

Comentarios.belongsTo(_Auth["default"]);
Comentarios.belongsTo(_Meeti["default"]);
var _default = Comentarios;
exports["default"] = _default;