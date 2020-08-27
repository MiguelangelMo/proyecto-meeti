import Auth from '../../models/Auth';
import Comentario from '../../models/Comentario';
import Meeti from '../../models/Meeti';
import uuid from 'uuid/v4'

export const agregar_comentario = async (req, res, next) => {

    const { comentario } = req.body;

    const comentarios = {};
    comentarios.id = uuid();

    if (!comentario) {
        res.redirect('back');
        return next();
    }

    comentarios.comantario = comentario;
    comentarios.authId = req.user.id;
    comentarios.meetiId = req.params.id

    console.log(comentario)


    await Comentario.create(comentarios);

    res.redirect('back');
    next();
}

export const eliminar_comentario = async (req, res, next) => {
    const comentario = await Comentario.findByPk(req.body.id);
    if (!comentario) {
        res.status(404).send('Operación no valida');
        return next();
    }
    const meeti = await Meeti.findOne({ where: { id: comentario.meetiId, authId: req.user.id } });
    if (comentario.authId === req.user.id || meeti) {
        try {
            await comentario.destroy({ where: { id: comentario.id, authId: req.user.id } });
            res.send('Se ha eliminado tu mensaje');
            return next()
        } catch (error) {
            res.status(401).send('Ha ocurrido un error');
        }
    } else {
        res.status(403).send('Operación no valida');
        return next();
    }
    next();
}