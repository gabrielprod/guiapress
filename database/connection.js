import Sequelize from 'sequelize'
const connection = new Sequelize('guiapress', 'root', 'pererinha.12', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

export default connection;