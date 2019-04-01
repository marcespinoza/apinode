const jwt = require('jsonwebtoken');
const fs = require('fs');
const sequelize = require('sequelize');
const path = require('path');
const User = require('../models/user');
const env = require('simpledot');

module.exports["registerUser"] = function (req,res){
		var fields = {
			email: req.body.email,
			name: req.body.name,
			lastname: req.body.lastname,
			password: req.body.password
		}
		//Check for profile picture
		if (req.files.picture) {
			var tmppath = req.files.picture.path;
			var tmpname = req.files.picture.name;    			
			var sourcepath = path.resolve(__dirname, '../../', './mondongo/public/uploads/' + tmpname);
			var targetpath = path.resolve(__dirname, '../../', './mondongo/public/uploads/');	

			fs.rename(tmppath, sourcepath, function (err) {
				if (err) {
					console.log("error");
				} else {
					fields = {
						email: req.body.email,
						name: req.body.name,
						lastname: req.body.lastname,
						password: req.body.password,
						picture: tmpname
					}  
				}
			});
		}

		var newUser = new User(fields);
		newUser.save({}, function (err, user) {
			if (err)  {
				res.json({
					status: 0,
					message: "There's a problem here!",
					error: err
				});
			} else {
			const userId = {id: user._id, salt: user.salt};
			const token = jwt.sign({userId}, env.SECRET_HASH);
			var data = {
				user: user,
				token: token
			}
			res.json({
				status: 1,
				message: "user added",
				data: data
			});
		  }
		})
}

module.exports["authenticateUser"] = function (req,res){
		User.findOne({email: req.body.email}, function (err, user) {
			if (err) {
				res.json({
				  status: 0,
				  message: "Error de conexion"
				})              
			} else {
			  if (!user || !user.authenticate(req.body.password)) {
				res.json({
				  status: 0,
				  message: "wrong credentials"
				})   
			  } else {
				  const userId = {id: user._id, salt: user.salt};
				  const token = jwt.sign({userId}, env.SECRET_HASH);
				  var data = {
					  user: user,
					  token: token
				  }            
				  res.json({
					status: 1,
					message: "login sucessfull",
					data: data
				  })
			  }
			}
		})
}

module.exports["login"] = function (req, res){
	console.log(req.body.email);
	User.findOne({where: {Email: req.body.email}, attributes: ['Id', 'Email']}).then(user => {
		if (!user) {
			res.json({
				status: 0,
				message: "Credenciales invalidos"
			});
		} else {
			const userId = {id: user.Id};
			const token = jwt.sign({userId}, env.SECRET_HASH);

			const data = {
				user: user,
				token: token
			}

			res.json({
				status: 1,
				message: "login sucessfull",
				data: data
			})	
		}	
	})
}
