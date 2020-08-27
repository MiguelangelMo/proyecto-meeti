import { Sequelize } from 'sequelize';
import db from '../config/db';
import Auth from './Auth';
import Meeti from './Meeti';

const Comentarios = db.define('comentarios', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    comantario: Sequelize.STRING(255),
},
    {
        timestamps: false
    }
);

Comentarios.belongsTo(Auth)
Comentarios.belongsTo(Meeti)

export default Comentarios;