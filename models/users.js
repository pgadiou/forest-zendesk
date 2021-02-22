/* eslint-disable no-undef */

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line no-unused-vars
  const { Sequelize } = sequelize;
  const Users = sequelize.define('users', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamp: true,
    schema: process.env.DATABASE_SCHEMA,
  });

  // Users.associate = (models) => {
  // };

  return Users;
};
