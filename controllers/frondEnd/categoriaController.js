import Categoria from '../../models/Categoria';
import Meeti from '../../models/Meeti';
import Grupos from '../../models/Grupos';
import Auth from '../../models/Auth';
import moment from 'moment';

export const mapeo_x_categoria = async (req, res, next) => {
    const categoria = await Categoria.findOne({
        where: { slug: req.params.slug },
        attributes: ['id', 'nombre']
    });
    const meeti = await Meeti.findAll({
        order: [
            ['fecha', 'ASC'],
            ['hora', 'ASC'],
        ],
        include: [
            {
                model: Grupos,
                where: { categoriumId: categoria.id }
            },
            {
                model: Auth
            }
        ],
    });

    if (!meeti) {
        res.redirect('/');
        return next();
    }

    res.render('categoria', {
        title: `Categoria: ${categoria.nombre}`,
        meeti,
        moment,
    })

}