const { DataTypes, Model } = require('sequelize');
const { connection } = require('../config/database');

class StationData extends Model {}

StationData.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  temperature: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  humidity: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  windSpeed: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  minWindSpeed: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  rainMillimeter: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  sequence: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0,
  }
}, {
  sequelize: connection,
  timestamps: true,
}
)

module.exports = StationData;