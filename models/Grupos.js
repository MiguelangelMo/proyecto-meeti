import { Sequelize } from 'sequelize';
import db from '../config/db';
import Categoria from './Categoria';
import Auth from './Auth';

const Grupos = db.define('grupos', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre del grupo es obligatorio'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La descripción del grupo es obligatorio'
            }
        }
    },
    categoria: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La categoría del grupo es obligatorio'
            }
        }
    },
    imagen: Sequelize.STRING,
    url: Sequelize.STRING,
});

// Relación de uno a uno
Grupos.belongsTo(Auth);
Grupos.belongsTo(Categoria);

export default Grupos;