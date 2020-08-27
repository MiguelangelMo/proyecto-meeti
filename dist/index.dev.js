"use strict";

var _express = _interopRequireDefault(require("express"));

var _home = _interopRequireDefault(require("./route/home"));

var _expressEjsLayouts = _interopRequireDefault(require("express-ejs-layouts"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _db = _interopRequireDefault(require("./config/db"));

var _passport = _interopRequireDefault(require("./config/passport"));

require("./models/Auth");

require("./models/Categoria");

require("./models/Grupos");

require("./models/Meeti");

require("./models/Comentario");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

_db["default"].sync().then(function () {
  return console.log('Conecto');
})["catch"](function (error) {
  return console.log(error);
});

// Variables
require('dotenv').config({
  path: 'variables.env'
});

var app = (0, _express["default"])();
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.set('view engine', 'ejs');
app.use(_expressEjsLayouts["default"]);
app.set('views', _path["default"].join(__dirname, './views'));
app.use(_express["default"]["static"]('public'));
app.use((0, _cookieParser["default"])());
app.use((0, _expressSession["default"])({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(_passport["default"].initialize());
app.use(_passport["default"].session());
app.use((0, _connectFlash["default"])());
app.use(function (req, res, next) {
  res.locals.user = _objectSpread({}, req.user) || null;
  res.locals.messages = req.flash(); // Fecha

  var fecha = new Date();
  res.locals.year = fecha.getFullYear();
  res.locals.mes = fecha.getMonth();
  res.locals.dia = fecha.getDate();
  next();
});
app.use('/', _home["default"]);
app.listen(process.env.PORT);