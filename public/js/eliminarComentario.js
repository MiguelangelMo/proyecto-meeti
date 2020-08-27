import Swal from 'sweetalert2';
import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelectorAll('.eliminar-comentario');
    if (form.length) {
        form.forEach(element => {
            element.addEventListener('submit', listenForm);
        })
    }
});

function listenForm(e) {
    e.preventDefault();
    Swal.fire({
        title: '¿Estás seguro de querer elimin',
        text: "Si lo eliminas no hay vuelta atras",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
        const data = { id: this.children[0].value }
        if (result.value) {
            axios.post(this.action, data)
                .then(result => {
                    Swal.fire(
                        'Eliminado',
                        result.data,
                        'success'
                    )
                    this.parentElement.parentElement.remove();
                }).catch(error => {
                    if (error.response.status === 403 || error.response.status === 404)
                        Swal.fire(
                            'Eliminado',
                            error.response.data,
                            'warning'
                        )
                })
        }
    })
}
