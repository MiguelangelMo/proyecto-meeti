import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    let formAsistir = document.getElementById('confirmar-asistencia');
    if (formAsistir) formAsistir.addEventListener('submit', confirmarAsistencia);

});

function confirmarAsistencia(e) {
    e.preventDefault();
    let formAsistir = document.querySelector('#confirmar-asistencia input[type=submit]');
    let inputAsistirONo = document.getElementById('accion').value;
    let mensaje = document.getElementById('mensaje');

    while (mensaje.firstChild) {
        mensaje.removeChild(mensaje.firstChild)
    }

    axios.post(this.action, { params: { data: inputAsistirONo } })
        .then(result => {
            if (inputAsistirONo === 'confirmar') {
                document.getElementById('accion').value = 'cancelar';
                formAsistir.value = 'Cancelar';
                formAsistir.classList.remove('btn-azul');
                formAsistir.classList.add('btn-rojo');
            } else {
                document.getElementById('accion').value = 'confirmar'
                formAsistir.value = 'Si';
                formAsistir.classList.remove('btn-rojo');
                formAsistir.classList.add('btn-azul');
            }
            Swal.fire({
                title: result.data,
                width: 600,
                padding: '3em',
                background: '#fff url(/images/trees.png)',
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("/images/nyan-cat.gif")
                  left top
                  no-repeat
                `
            })
        });
}
