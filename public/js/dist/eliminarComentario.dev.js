"use strict";

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelectorAll('.eliminar-comentario');

  if (form.length) {
    form.forEach(function (element) {
      element.addEventListener('submit', listenForm);
    });
  }
});

function listenForm(e) {
  var _this = this;

  e.preventDefault();

  _sweetalert["default"].fire({
    title: '¿Estás seguro de querer elimin',
    text: "Si lo eliminas no hay vuelta atras",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, estoy seguro'
  }).then(function (result) {
    var data = {
      id: _this.children[0].value
    };

    if (result.value) {
      _axios["default"].post(_this.action, data).then(function (result) {
        _sweetalert["default"].fire('Eliminado', result.data, 'success');

        _this.parentElement.parentElement.remove();
      })["catch"](function (error) {
        if (error.response.status === 403 || error.response.status === 404) _sweetalert["default"].fire('Eliminado', error.response.data, 'warning');
      });
    }
  });
}