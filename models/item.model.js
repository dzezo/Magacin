var neo4j = require('neo4j-driver').v1;
var config = require('../config/database');

// Database
var driver = neo4j.driver(config.database, neo4j.auth.basic(config.username, config.password));
var session = driver.session();

// GET
module.exports.getItemByName = function (name, callback) {
	// Session
	session
		.run(
			'MATCH (n:Item {name: $name}) RETURN n',
			{name: name}
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
module.exports.addItem = function (newItem, username, res) {
	// Session
	session
		.run(
			'CREATE (a: Item {code: $code, name: $name, quantity: $quantity, purchaseP: $purchaseP, sellingP: $sellingP})',
			{
				code: newItem.code, 
				name: newItem.name, 
				quantity: newItem.quantity, 
				purchaseP: newItem.purchaseP, 
				sellingP: newItem.sellingP
			}
		)
		.then((result)=>{
			session.close();

			inStock(newItem.name, username, res);
		})
		.catch(function(err){
			session.close();

			res.json({ success: false, msg: 'Neuspesno kreiranje.' });
			console.log(err);
		});
	// Session End
}
// PUT
// DELETE
// OTHER
function inStock(itemName, username, res) {
	// Session
	session
		.run(
			'MATCH (a:User {username: $username}), (b: Item {name: $name}) MERGE (a)-[r:inStock]-(b) RETURN a,b',
			{
				username: username,
				name: itemName
			}
		)
		.then((result)=>{
			session.close();

			res.json({ success: true, msg: 'Artikl kreiran.' });
		})
		.catch(function(err){
			session.close();

			res.json({ success: false, msg: 'Neuspesno kreiranje.' });
			console.log(err);
		});
	// Session End
}