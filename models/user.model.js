var bcrypt = require('bcryptjs');
var neo4j = require('../config/neo4j/dbUtils');

var session = neo4j.getSession();

// GET
module.exports.getUserByUsername = function (username, callback) {
	// Session
	session
		.run(
			'MATCH (n:User {username: $user}) RETURN n',
			{user: username}
		)
		.then((result)=>{
			session.close();
			
			if(result.records[0])
				callback(result.records[0]._fields[0]);
			else
				callback(null);
		})
		.catch(function(err){
			session.close();

			console.log(err);
		});
	// Session End
}

// POST
module.exports.addUser = function (newUser, res) {
	// Hash password
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			if(err)
				throw err; 
			newUser.password = hash;
			// Save to DB
			// Session
			session
				.run(
					'CREATE (a: User {name: $name, email: $mail, username: $user, password: $pass})',
					{name: newUser.name, mail: newUser.email, user: newUser.username, pass: newUser.password}
				)
				.then((result)=>{
					session.close();

					res.json({ success: true, msg: 'Korisnik registrovan.' });
				})
				.catch(function(err){
					session.close();

					res.json({ success: false, msg: 'Neuspesno registrovanje.' });
					console.log(err);
				});
			// Session End
		});
	});
}

// OTHER
module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		if(err)
			throw err;
		callback(null, isMatch);
	});
}