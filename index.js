import express from 'express';
import route from './route/home';
import expressLayouts from 'express-ejs-layouts';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import bodyParser from 'body-parser';
import db from './config/db';
import passport from './config/passport';
db.sync().then(() => console.log('Conecto')).catch(error => console.log(error));
import './models/Auth';
import './models/Categoria';
import './models/Grupos';
import './models/Meeti';
import './models/Comentario';

// Variables
require('dotenv').config({ path: 'variables.env' });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'))

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.user = { ...req.user } || null;
    res.locals.messages = req.flash();

    // Fecha
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    res.locals.mes = fecha.getMonth();
    res.locals.dia = fecha.getDate();
    next();
});

app.use('/', route);

app.listen(process.env.PORT);