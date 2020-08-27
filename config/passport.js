import passport from 'passport';
const localStrategy = require('passport-local').Strategy;
import Auth from '../models/Auth';

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const auth = await Auth.findOne({ where: { email } });
    if (!auth) return done(null, false, {
        message: 'Ese usuario no existe'
    });

    const validar = auth.validPassword(password);
    if (!validar) return done(null, false, {
        message: 'Password incorrecto'
    });

    return done(null, auth)
}));

passport.serializeUser(function (usuario, cb) {
    cb(null, usuario)
})
passport.deserializeUser(function (usuario, cb) {
    cb(null, usuario)
})

module.exports = passport;