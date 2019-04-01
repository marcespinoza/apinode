/**
 * Created by vedi on 23/08/14.
 */

// 'use strict';

// const mongoose = require('../config/mongoose');

// const modelName = 'User';

// const _ = require('lodash');
// const crypto = require('crypto');


// const schema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   hashedPassword: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   lastname: {
//     type: String,
//     required: true,
//   },
//   salt: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   picture: {
//     type: String
//   }
// });

// /**
//  * Create instance method for hashing a password
//  */
// schema.methods.hashPassword = function hashPassword(password) {
//   if (this.salt && password) {
//     return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
//   } else {
//     return password;
//   }
// };

// schema.virtual('password')
//   .set(function setPassword(password) {
//     this._plainPassword = password;
//     this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
//     this.hashedPassword = this.hashPassword(password);
//   })
//   .get(function getPassword() {
//     return this._plainPassword;
//   });
  
// module.exports = mongoose.model(modelName, schema);
const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('AspNetUsers', {
  Id: {
    type: Sequelize.STRING
  },
  Email: {
    type: Sequelize.STRING
  }
});

module.exports = User;

// // force: true will drop the table if it already exists
// User.sync({force: true}).then(() => {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });

