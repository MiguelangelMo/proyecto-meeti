"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

document.addEventListener('DOMContentLoaded', function () {
  var formAsistir = document.getElementById('confirmar-asistencia');
  if (formAsistir) formAsistir.addEventListener('submit', confirmarAsistencia);
});

function confirmarAsistencia(e) {
  e.preventDefault();
  var formAsistir = document.querySelector('#confirmar-asistencia input[type=submit]');
  var inputAsistirONo = document.getElementById('accion').value;
  var mensaje = document.getElementById('mensaje');

  while (mensaje.firstChild) {
    mensaje.removeChild(mensaje.firstChild);
  }

  _axios["default"].post(this.action, {
    params: {
      data: inputAsistirONo
    }
  }).then(function (result) {
    if (inputAsistirONo === 'confirmar') {
      document.getElementById('accion').value = 'cancelar';
      formAsistir.value = 'Cancelar';
      formAsistir.classList.remove('btn-azul');
      formAsistir.classList.add('btn-rojo');
    } else {
      document.getElementById('accion').value = 'confirmar';
      formAsistir.value = 'Si';
      formAsistir.classList.remove('btn-rojo');
      formAsistir.classList.add('btn-azul');
    }

    _sweetalert["default"].fire({
      title: result.data,
      width: 600,
      padding: '3em',
      background: '#fff url(/images/trees.png)',
      backdrop: "\n                  rgba(0,0,123,0.4)\n                  url(\"/images/nyan-cat.gif\")\n                  left top\n                  no-repeat\n                "
    });
  });
}