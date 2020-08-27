import Categoria from '../models/Categoria';
import Grupos from '../models/Grupos';
import Meeti from '../models/Meeti';
import moment from 'moment';
import { Op } from 'sequelize';
import Auth from '../models/Auth';

export const index = async (req, res) => {
    const fechaActual = moment(new Date()).format('YYYY-MM-DD');

    const categoriaPromise = Categoria.findAll();

    const meetiPromise = Meeti.findAll({
        limit: 3,
        attributes: ['slug', 'titulo', 'fecha', 'hora'],
        where: {
            fecha: { [Op.gte]: fechaActual }
        },
        order: [
            ['fecha', 'ASC']
        ],
        include: [
            {
                model: Grupos,
                attributes: ['imagen']
            },
            {
                model: Auth,
                attributes: ['nombre', 'imagen']
            }
        ]
    });

    const [categoria, meeti /*, grupos , meet*/] = await Promise.all([categoriaPromise, meetiPromise /*, gruposPromise*/]);

    res.render('home', {
        title: 'Inicio',
        categoria,
        meeti,
        moment,
        //meet,
    });
}