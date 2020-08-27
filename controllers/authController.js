import Auth from '../models/Auth';
import { validationResult, } from 'express-validator';
import { main } from '../handlers/mail';
import passport from 'passport';

export const crear_cuenta_get = (req, res) => {
    res.render('crear-cuenta', {
        title: 'Crear Cuenta'
    });
}

export const crear_cuenta_post = async (req, res) => {
    const errors = validationResult(req);
    const { email } = req.body;
    try {
        await Auth.create(req.body);

        const configMail = {
            url: `http://${req.headers.host}/confirmar-cuenta/${email}`,
            email,
            host: req.headers.host,
            subject: 'Confirma tu cuenta en meeti',
            archivo: 'confirmar-cuenta'
        }

        await main(configMail);

        req.flash('exito', 'Se ha registrado correctamente');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        const errs = Array.isArray(error.errors) ? error.errors.map(error => error.message) : null;
        const errsExpress = errors.errors.map(error => error.msg);
        const arrayError = [...errs];
        req.flash('error', arrayError);
        res.redirect('/crear-cuenta');
    }
}

export const iniciar_sesion_get = (req, res) => {
    res.render('iniciar-sesion', {
        title: 'Iniciar Sesión'
    });
}

export const iniciar_sesion_post = passport.authenticate('local',{
    successRedirect: '/landing-page',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Por favor, complete los campos'
});

export const autentificarUser = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }

    req.flash('error', 'Por facor, inicia sesión nuevamente');
    return res.redirect('/iniciar-sesion');
}

export const confirmar_cuenta_get = async (req, res, next) => {
    const auth = await Auth.findOne({ where: { email: req.params.email } });
    if (!auth) {
        req.flash('error', 'No existe el correo, intente nuevamente');
        res.redirect('/crear-cuenta');
        return next();
    }
    auth.activo = 1;
    await auth.save();
    req.flash('exito', 'Inicia sesión en Meeti te esperamos');
    res.redirect('/iniciar-sesion');
}

export const cerrar_sesion_get = (req, res) => {
    req.logout();
    res.redirect('/');
}