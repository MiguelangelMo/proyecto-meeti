import Auth from '../../models/Auth';
import Grupos from '../../models/Grupos';

export const perfil_usuario = async (req, res) => {
    const authPromise = Auth.findByPk(req.params.id);
    const gruposPromise = Grupos.findAll({ where: { authId: req.params.id } });
    const [auth, grupos] = await Promise.all([authPromise, gruposPromise]);
    res.render('show-usuario', {
        title: `Pérfil - ${auth.nombre}`,
        auth,
        grupos
    });
}