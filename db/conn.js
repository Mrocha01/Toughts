const { log } = require('console');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts2', 'root', 'root1234', {
    host: 'localhost',
    dialect: 'mysql',
});

try {
    sequelize.authenticate();
    console.log('Conectamos com Sucesso!');
} catch (error) {
    console.log(`Não foi possivel conectar: ${error.message}`);
}

module.exports = sequelize;