import Meeti from '../../models/Meeti';
import Grupos from '../../models/Grupos';
import Comentario from '../../models/Comentario';
import Auth from '../../models/Auth';
import { Sequelize, where, Op } from 'sequelize';
import moment from 'moment';

export const showMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({
        where: { slug: req.params.slug },
        include: [
            {
                model: Grupos,
            },
            {
                model: Auth,
                attributes: ['nombre', 'id', 'imagen']
            },
        ]
    });

    if (!meeti) {
        req.flash('error', 'Not Found');
        res.redirect('/');
        return next();
    }

    const comentarios = await Comentario.findAll({
        where: { meetiId: meeti.id },
        include: [
            {
                model: Auth,
                attributes: ['nombre', 'id', 'imagen']
            }
        ]
    });

    res.render('show-meeti', {
        title: meeti.titulo,
        meeti,
        moment,
        comentarios,
    })
}

export const asistir = async (req, res, next) => {

    if (req.body.params.data === 'confirmar') {
        Meeti.update(
            {
                'interesados': Sequelize.fn('array_append',
                    Sequelize.col('interesados'),
                    req.user.id)
            },
            { 'where': { 'slug': req.params.slug } }
        );
        res.status(200).send('Se ha confirmado tu asistencia, te esperamos');
    } else {
        Meeti.update(
            {
                'interesados': Sequelize.fn('array_remove',
                    Sequelize.col('interesados'),
                    req.user.id)
            },
            { 'where': { 'slug': req.params.slug } }
        )
        res.status(200).send('Has removido tu asistencia, ¿Por qué no nos acompaña? sera una gran esperiencia');
    }
}

export const verAsistente = async (req, res) => {
    const meeti = await Meeti.findOne({ where: { slug: req.params.slug }, attributes: ['interesados'] });
    const { interesados } = meeti;
    const asistente = await Auth.findAll({
        where: {
            id: interesados
        },
        attributes: ['nombre', 'imagen']
    });
    res.render('asistente-meeti', {
        title: 'Asistentes',
        asistente
    })
}

export const buscar_meeti = async (req, res) => {

    const { categoria, titulo, ciudad, pais } = req.query;

    let query;
    if(categoria) query = '';
    else query = `where: { categoria: { [Op.eq]: categoria } }`

    const meetis = await Meeti.findAll({
        where: {
            titulo: { [Op.iLike]: `%${titulo}%` },
            ciudad: { [Op.iLike]: `%${ciudad}%` },
            pais: { [Op.iLike]: `%${pais}%` },
        },
        include: [
            {
                model: Grupos,
                attributes: ['categoria', 'nombre', 'descripcion', 'imagen'],
                query,
            },
            {
                model: Auth,
                attributes: ['nombre', 'id', 'imagen']
            }
        ]
    });

    res.render('buscador', {
        title: 'Resultados',
        meetis,
        moment,
    });
}