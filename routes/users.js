var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/neo4j/dbConfig');
var User = require('../models/user.model');


// Register
router.post('/register', function (req, res, next) {
	// Create user
	var newUser = {
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	};
	// Check username
	User.getUserByUsername(newUser.username, function(user){
		if(user)
			return res.json({ success: false, msg: 'Korisnik vec postoji.' });
		// Add new user
		User.addUser(newUser, res);
	});
});

// Authenticate
router.post('/authenticate', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.getUserByUsername(username, function (user) {
		if(!user){
			return res.json({ success: false, msg: 'Korisnik nije pronadjen.' });
		}

		User.comparePassword(password, user.properties.password, function (err, isMatch) {
			if(err)
				throw err;
			if(isMatch){
				var token = jwt.sign(user, config.secret, {
					expiresIn: '7d'
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					// Return user without password
					user: {
						name: user.properties.name,
						username: user.properties.username,
						email: user.properties.email
					}
				});
			}
			else {
				return res.json({ success: false, msg: 'Pogresna Lozinka.' });
			}
		})
	});
});

module.exports = router;