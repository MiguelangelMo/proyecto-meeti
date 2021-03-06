import { Sequelize } from 'sequelize';
import db from '../config/db';
import uuid from 'uuid/v4';
import slug from 'slug';
import shortid from 'shortid';

import Auth from './Auth';
import Grupos from './Grupos';

const Meeti = db.define('meeti', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid()
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un Titulo'
            }
        }
    },
    slug: {
        type: Sequelize.STRING,
    },
    invitado: Sequelize.STRING,
    cupo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una descripción'
            }
        }
    },
    fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una fecha para el Meeti'
            }
        }
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una hora para el Meeti'
            }
        }
    },
    direccion: {
        type: Sequelize.STRING,
        // allowNull: false,
        // validate: {
        //     notEmpty: {
        //         msg: 'Agrega una dirección'
        //     }
        // }
    },
    ciudad: {
        type: Sequelize.STRING,
        // allowNull: false,
        // validate: {
        //     notEmpty: {
        //         msg: 'Agrega una Ciudad'
        //     }
        // }
    },
    estado: {
        type: Sequelize.STRING,
        // allowNull: false,
        // validate: {
        //     notEmpty: {
        //         msg: 'Agrega un estado'
        //     }
        // }
    },
    pais: {
        type: Sequelize.STRING,
        // allowNull: false,
        // validate: {
        //     notEmpty: {
        //         msg: 'Agrega un país'
        //     }
        // }
    },
    interesados: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
}, {
    hooks: {
        async beforeCreate(meeti) {
            const url = slug(meeti.titulo).toLowerCase();
            meeti.slug = `${url}-${shortid.generate()}`;
        }
    }
});
Meeti.belongsTo(Auth);
Meeti.belongsTo(Grupos);

export default Meeti;