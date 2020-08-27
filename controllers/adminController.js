import Categoria from '../models/Categoria';
import Grupos from '../models/Grupos';
import Meeti from '../models/Meeti';
import Auth from '../models/Auth';
import { Op, where } from 'sequelize'
import multer from 'multer';
import shorid from 'shortid';
import fs from 'fs';
import moment from 'moment';
import uuid from 'uuid/v4';

export const landing_page_get = async (req, res) => {

    const fechaActual = moment(new Date()).format('YYYY-MM-DD');

    const gruposPromise = Grupos.findAll({
        where: {
            authId: req.user.id
        }
    });
    const meetiPromise = Meeti.findAll({
        where: {
            authId: req.user.id,
            fecha: { [Op.gte]: fechaActual }
        },
        order: [
            ['fecha', 'ASC']
        ]
    });
    const meetiAPromise = Meeti.findAll({
        where: {
            authId: req.user.id,
            fecha: { [Op.lte]: fechaActual }
        }
    });

    const [grupos, meeti, meet] = await Promise.all([gruposPromise, meetiPromise, meetiAPromise]);

    res.render('lading-page', {
        title: 'Panel administrativo',
        grupos,
        meeti,
        meet,
        moment,
    });
}

export const nuevo_grupo_get = async (req, res) => {
    const categoria = await Categoria.findAll();
    res.render('form-nuevo-grupo', {
        title: 'Crea un nuevo grupo',
        categoria
    });
}
export const nuevo_grupo_post = async (req, res, next) => {

    req.body.authId = req.user.id;
    req.body.categoriumId = req.body.categoria;
    req.body.id = uuid();
    if (req.file)
        req.body.imagen = req.file.filename;

    try {
        await Grupos.create(req.body);
        req.flash('exito', 'Se ha creado el grupo correctamente.');
        res.redirect('/landing-page');
    } catch (error) {
        const errs = Array.isArray(error.errors) ? error.errors.map(error => error.message) : null;
        req.flash('error', errs);
        return res.redirect('/nuevo-grupo')
    }
}

export const subirFoto = (req, res, next) => {
    uploadAuth(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El Archivo es muy grande')
                } else {
                    req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    });
}

const configuracionMulter = {
    limits: { fileSize: 1000000 },
    storage: multer.diskStorage({
        destination: (res, file, cb) => {
            cb(null, __dirname + '/../public/uploads/grupos')
        },
        filename: (req, file, cb) => {
            const extencion = file.mimetype.split('/');
            const nombreImagen = `${shorid.generate()}.${extencion[1]}`;
            cb(null, nombreImagen);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
        else cb(new Error('Formato no valido'), false);
    }
}

export const upload = multer(configuracionMulter).single('imagen');

const configuracionMulterAuth = {
    limits: { fileSize: 1000000 },
    storage: multer.diskStorage({
        destination: (res, file, cb) => {
            cb(null, __dirname + '/../public/uploads/perfil')
        },
        filename: (req, file, cb) => {
            const extencion = file.mimetype.split('/');
            const nombreImagen = `${shorid.generate()}.${extencion[1]}`;
            cb(null, nombreImagen);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') cb(null, true);
        else cb(new Error('Formato no valido'), false);
    }
}

const uploadAuth = multer(configuracionMulterAuth).single('imagen');

export const editar_grupo_get = async (req, res) => {
    const grupoPromise = Grupos.findByPk(req.params.id);
    const categoriaPromise = Categoria.findAll();
    const [grupo, categoria] = await Promise.all([grupoPromise, categoriaPromise]);
    res.render('editar-grupo', {
        title: `Editar Grupo - ${grupo.nombre}`,
        grupo,
        categoria
    });
}

export const editar_grupo_post = async (req, res) => {
    const grupo = await Grupos.findByPk({ where: { id: req.params.id, authId: req.user.id } });
    const { nombre, descripcion, categoria, url } = req.body;
    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoria = categoria;
    grupo.url = url;
    await grupo.save();
    req.flash('exito', 'Cambios Guardados');
    res.redirect('/landing-page');
}

export const editar_imagen_get = async (req, res) => {
    const imgGrupo = await Grupos.findByPk(req.params.id);
    res.render('editar-imagen', {
        title: `Editar Imagen - ${imgGrupo.nombre}`,
        imgGrupo
    });
}

export const editar_imagen_post = async (req, res, next) => {
    const imgGrupo = await Grupos.findOne({ where: { id: req.params.id, authId: req.user.id } });
    if (!imgGrupo) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next();
    }

    if (req.file && imgGrupo.imagen) {
        const imgAfterPath = `${__dirname}/../public/uploads/grupos/${imgGrupo.imagen}`;
        fs.unlink(imgAfterPath, (error) => {
            console.log(error)
        });
    }
    if (req.file) imgGrupo.imagen = req.file.filename
    await imgGrupo.save();
    req.flash('exito', 'Se ha actualizado su foto del grupo');
    res.redirect('/landing-page');
}

export const eliminar_grupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.id, authId: req.user.id } });
    if (!grupo) {
        req.flash('error', 'Operación no válida');
        res.redirect('/iniciar-sesion');
        return next();
    }

    if (grupo.imagen) {
        const imgAfterPath = `${__dirname}/../public/uploads/grupos/${grupo.imagen}`;
        fs.unlink(imgAfterPath, (error) => {
            console.log(error)
        });
    }

    await grupo.destroy();
    req.flash('exito', 'Su grupo se ha borrado');
    res.redirect('/landing-page');
}

export const nuevo_meeti_get = async (req, res) => {
    const grupos = await Grupos.findAll({ where: { authId: req.user.id } });
    res.render('form-nuevo-meeti', {
        title: 'Crear un Nuevo Meeti',
        grupos
    });
}

export const nuevo_meeti_post = async (req, res) => {
    const data = req.body;
    data.authId = req.user.id;
    data.id = uuid();
    // const point = { type: 'Point', coordinates: [parseFloat(data.lat), parseFloat(data.lng)] }
    // data.ubicacion = point;
    if (!req.body.cupo) {
        data.cupo = 0;
    }
    try {
        await Meeti.create(data);
        req.flash('exito', 'Se ha guardado correctamente');
        res.redirect('/landing-page');
    } catch (error) {
        console.log(error);
        const errs = Array.isArray(error.errors) ? error.errors.map(error => error.message) : null;
        req.flash('error', errs);
        res.redirect('/nuevo-meeti');
    }
}

export const editar_meeti_get = async (req, res) => {
    const meetiPromise = Meeti.findOne({ where: { id: req.params.id, authId: req.user.id } });
    const gruposPromise = Grupos.findAll({ where: { authId: req.user.id } });
    const [meeti, grupos] = await Promise.all([meetiPromise, gruposPromise]);
    res.render('editar-meeti', {
        title: `Editar Meeti - ${meeti.titulo}`,
        meeti,
        grupos,
    });
}

export const editar_meeti_post = async (req, res, next) => {
    const meeti = await Meeti.findOne({ where: { id: req.params.id, authId: req.user.id } });
    if (!meeti) {
        req.flash('error', 'Operacaón no valida');
        res.redirect('landing-page');
        return next();
    }
    const { titulo,
        invitado,
        fecha,
        hora,
        cupo,
        descripcion,
        direccion,
        ciudad,
        estado,
        pais } = req.body;

    meeti.titulo = titulo;
    meeti.fecha = fecha;
    meeti.hora = hora;
    if (!cupo) meeti.cupo = 0;
    meeti.descripcion = descripcion;
    if (direccion) meeti.direccion = direccion;
    if (ciudad) meeti.ciudad = ciudad;
    if (estado) meeti.estado = estado;
    if (pais) meeti.pais = pais;
    if (invitado) meeti.invitado = invitado;

    try {
        await meeti.save();
        req.flash('exito', 'Se ha guardado correctamente');
        res.redirect('/landing-page')
    } catch (error) {
        console.log(error)
        req.flash('error', error);
        res.redirect('/landing-page');
    }
}

export const eliminar_meeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({ where: { id: req.params.id, authId: req.user.id } });
    if (!meeti) {
        req.flash('error', 'Operacaón no valida');
        res.redirect('landing-page');
        return next();
    }
    try {
        await meeti.destroy();
        req.flash('exito', 'Se ha borrado el registro');
        res.redirect('/landing-page');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Error en la operación');
        res.redirect('/landing-page');
    }
}

export const editar_perfil_get = async (req, res, next) => {
    const auth = await Auth.findOne({ where: { id: req.user.id } });
    if (!auth) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next()
    }
    res.render('form-editar-perfil', {
        title: `Editar Perfíl - ${auth.nombre}`,
        auth,
    })
}

export const editar_perfil_post = async (req, res) => {
    const auth = await Auth.findByPk(req.user.id);
    if (!auth) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next()
    }
    auth.nombre = req.body.nombre;
    auth.descripcion = req.body.descripcion;
    auth.email = req.body.email;
    try {
        await auth.save();
        req.flash('exito', 'Se ha guardado correctamente');
        res.redirect('/landing-page');
    } catch (error) {
        const errs = Array.isArray(error.errors) ? error.errors.map(error => error.message) : null;
        req.flash('error', errs);
        res.redirect('/landing-page');
    }
}

export const editar_password_get = async (req, res) => {
    const auth = await Auth.findByPk(req.user.id);
    if (!auth) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next()
    }
    res.render('form-editar-password', {
        title: 'Cambiar Password'
    });
}
export const editar_password_post = async (req, res, next) => {
    const auth = await Auth.findOne({ where: { id: req.user.id } });
    if (!auth) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next()
    }

    const passwordOLD = auth.validPassword(req.body.passwordOld);
    if (!passwordOLD) {
        req.flash('error', 'Password actual no es correcto');
        res.redirect('/editar-password');
        return next()
    }

    auth.password = auth.hashPassword(req.body.passwordNew);
    try {
        await auth.save();
        req.flash('exito', 'Se ha guardado correctamente');
        res.redirect('/landing-page');
    } catch (error) {
        const errs = Array.isArray(error.errors) ? error.errors.map(error => error.message) : null;
        req.flash('error', errs);
        res.redirect('/landing-page');
    }
}

export const editar_imagen_perfil_get = async (req, res, next) => {
    const auth = await Auth.findByPk(req.user.id);
    if (!auth) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next()
    }
    res.render('form-editar-imagen-perfil', {
        title: 'Cambiar Imagen de Perfil',
        auth
    });
}

export const editar_imagen_perfil_post = async (req, res, next) => {
    const auth = await Auth.findByPk(req.user.id);
    if (!auth) {
        req.flash('error', 'Operación no valida');
        res.redirect('/iniciar-sesion');
        return next();
    }

    if (req.file && auth.imagen) {
        const imgAfterPath = `${__dirname}/../public/uploads/perfil/${auth.imagen}`;
        fs.unlink(imgAfterPath, (error) => {
            console.log(error)
        });
    }
    if (req.file) auth.imagen = req.file.filename
    await auth.save();
    req.flash('exito', 'Se ha actualizado su foto de su perdil');
    res.redirect('/landing-page');
}