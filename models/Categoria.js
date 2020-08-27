import { Sequelize } from 'sequelize';
import db from '../config/db';

const Categorias = db.define('categoria', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    nombre: Sequelize.TEXT,
    slug: Sequelize.STRING(50)
}, {
    timestamps: false
});

export default Categorias;