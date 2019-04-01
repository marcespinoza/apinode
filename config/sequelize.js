/**
 * Sequelize
 */

'use strict';

const env = require('simpledot');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: 'smts.cjup94k2g7mf.us-east-1.rds.amazonaws.com',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

module.exports = sequelize