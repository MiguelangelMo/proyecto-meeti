import Grupos from '../../models/Grupos';
import Meeti from '../../models/Meeti';
import moment from 'moment';

export const mostrar_grupo = async (req, res, next) => {
    const gruposPromise = Grupos.findByPk(req.params.id);
    const meetiPromise = Meeti.findAll({
        where: { grupoId: req.params.id },
        order: [
            ['fecha', 'ASC']
        ]
    });

    const [grupo, meeti] = await Promise.all([gruposPromise, meetiPromise]);

    if (!grupo) return next();

    res.render('show-grupos', {
        title: `${grupo.nombre}`,
        grupo,
        meeti,
        moment,
    })
}