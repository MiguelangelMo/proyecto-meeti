import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('meeti', 'postgres', 1, {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // define: {
    //     timestamps: false
    // },
    //logging: false
});

export default sequelize;