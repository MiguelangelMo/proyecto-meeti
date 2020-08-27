import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/db';
import bcrypt from 'bcrypt';

const Auth = db.define('auths', {
    // Model attributes are defined here
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: { msg: 'E-Mail no valido' }
        },
        unique: {
            args: true,
            msg: 'Ususario ya registrado',
        }
    },
    nombre: Sequelize.STRING(60),
    descripcion: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'descripción es obligatorio' },
        }
    },
    imagen: Sequelize.STRING(60),
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Password es obligatorio' },
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: {
        type: Sequelize.STRING
    },
    expira: {
        type: Sequelize.DATE
    }
}, {
    hooks: {
        beforeCreate(auth) {
            auth.password = bcrypt.hashSync(auth.password, bcrypt.genSaltSync(8));
        }
    }
});

Auth.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}
Auth.prototype.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}
export default Auth;