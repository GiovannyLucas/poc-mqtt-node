const { Sequelize } = require('sequelize');
const { resolve } = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: resolve(__dirname, '..', 'database', 'database.sqlite'),
});

module.exports = {
  connection: sequelize,
  connect: async () => {
    try {
      await sequelize.sync();
      const aaa = await sequelize.query('SELECT AVG(temperature), AVG(humidity) FROM StationData LIMIT 1');
      console.log(aaa)
      console.log('Database connected!')
      return sequelize;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}