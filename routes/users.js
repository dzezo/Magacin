var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/database');
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
			return res.json({ success: false, msg: 'Username already taken.' });
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
			return res.json({ success: false, msg: 'User not found.' });
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
						id: user.identity.low,
						name: user.properties.name,
						username: user.properties.username,
						email: user.properties.email
					}
				});
			}
			else {
				return res.json({ success: false, msg: 'Wrong password.' });
			}
		})
	});
});

module.exports = router;