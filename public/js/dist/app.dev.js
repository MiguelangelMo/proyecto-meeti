"use strict";

var _leafletGeosearch = require("leaflet-geosearch");

var _asistencia = _interopRequireDefault(require("./asistencia"));

require("./eliminarComentario");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// obtener valores de la base de datos
var lat = document.querySelector('#lat').value || 20.666332695977;
var lng = document.querySelector('#lng').value || -103.3921777456999;
var direccion = document.querySelector('#direccion').value || '';
var map = L.map('mapa').setView([lat, lng], 15);
var markers = new L.FeatureGroup().addTo(map);
var marker; // Utilizar el provider y GeoCoder

var geocodeService = L.esri.Geocoding.geocodeService(); // Colocar el Pin en Edición

if (lat && lng) {
  // agregar el pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true
  }).addTo(map).bindPopup(direccion).openPopup(); // asignar al contenedor markers

  markers.addLayer(marker); // detectar movimiento del marker

  marker.on('moveend', function (e) {
    marker = e.target;
    var posicion = marker.getLatLng();
    map.panTo(new L.LatLng(posicion.lat, posicion.lng)); // reverse geocoding, cuando el usuario reubica el pin

    geocodeService.reverse().latlng(posicion, 15).run(function (error, result) {
      llenarInputs(result); // asigna los valores al popup del marker

      marker.bindPopup(result.address.LongLabel);
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map); // buscar la dirección

  var buscador = document.querySelector('#formbuscador');
  buscador.addEventListener('input', buscarDireccion);
});

function buscarDireccion(e) {
  if (e.target.value.length > 8) {
    // si existe un pin anterior limpiarlo
    markers.clearLayers();
    var provider = new _leafletGeosearch.OpenStreetMapProvider();
    provider.search({
      query: e.target.value
    }).then(function (resultado) {
      geocodeService.reverse().latlng(resultado[0].bounds[0], 15).run(function (error, result) {
        llenarInputs(result); // console.log(resultado);
        // mostrar el mapa

        map.setView(resultado[0].bounds[0], 15); // agregar el pin

        marker = new L.marker(resultado[0].bounds[0], {
          draggable: true,
          autoPan: true
        }).addTo(map).bindPopup(resultado[0].label).openPopup(); // asignar al contenedor markers

        markers.addLayer(marker); // detectar movimiento del marker

        marker.on('moveend', function (e) {
          marker = e.target;
          var posicion = marker.getLatLng();
          map.panTo(new L.LatLng(posicion.lat, posicion.lng)); // reverse geocoding, cuando el usuario reubica el pin

          geocodeService.reverse().latlng(posicion, 15).run(function (error, result) {
            llenarInputs(result); // asigna los valores al popup del marker

            marker.bindPopup(result.address.LongLabel);
          });
        });
      });
    });
  }
}

function llenarInputs(resultado) {
  document.querySelector('#direccion').value = resultado.address.Address || '';
  document.querySelector('#ciudad').value = resultado.address.City || '';
  document.querySelector('#estado').value = resultado.address.Region || '';
  document.querySelector('#pais').value = resultado.address.CountryCode || '';
  document.querySelector('#lat').value = resultado.latlng.lat || '';
  document.querySelector('#lng').value = resultado.latlng.lng || '';
}