var neo4j = require('neo4j-driver').v1;
var config = require('../config/database');

// Database
var driver = neo4j.driver(config.database, neo4j.auth.basic(config.username, config.password));
var session = driver.session();

// GET

module.exports.getItem = function (username, code, callback){
	session
		.run(
			'MATCH (a:Item {code: $code})-[]-(:User {username: $username}) ' +
			'WITH a ' +
			'MATCH (b)-[r1:IN]-(a) ' +
			'WITH a, COLLECT({rel: r1, inv: b}) AS INPUT ' +
			'MATCH (a)-[r2:OUT]-(c) ' +
			'WITH a, INPUT, COLLECT({rel: r2, inv: c}) AS OUTPUT ' +
			'RETURN a, INPUT, OUTPUT',
			{
				username: username,
				code: parseInt(code)
			}
		)
		.then((result)=>{
			session.close();
			var item = result.records[0].get(0);
			var inputs = result.records[0].get(1);
			var outputs = result.records[0].get(2);

			var itemProfile = {};
			itemProfile.details = item.properties;
			itemProfile.inputs = [];
			itemProfile.outputs = [];

			inputs.forEach((input)=>{
				itemProfile.inputs.push({
					in: input.rel.properties,
					details: input.inv.properties
				});
			});
			outputs.forEach((output)=>{
				itemProfile.outputs.push({
					out: output.rel.properties,
					details: output.inv.properties
				});
			});
			callback(null, itemProfile);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

module.exports.getItems = function (username, callback){
	session
		.run(
			'MATCH (a:User {username: $username})-[r:IN_STOCK]-(b:Item) ' +
			'RETURN { id: ID(b), code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP } AS ITEM',
			{ username: $username }
		)
		.then((result)=>{
			session.close();
			var items = [];
			for(var i=0; i<result.records.length; i++)
			{
				items.push(result.records[i].get(0));	
			}
			callback(null, items);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

module.exports.getArchivedItems = function (username, callback){
	session
		.run(
			'MATCH (a:User {username: $username})-[r:ARCHIVED]-(b:Item) ' +
			'RETURN { id: ID(b), code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP } AS ITEM',
			{ username: $username }
		)
		.then((result)=>{
			session.close();
			var items = [];
			for(var i=0; i<result.records.length; i++)
			{
				items.push(result.records[i].get(0));	
			}
			callback(null, items);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

// PUT

module.exports.updateItem = function (username, code, update, callback){
	session
		.run(
			'MATCH (a:Item {code: $code})-[]-(:User {username: $username}) SET a.code= $newCode, a.name= $newName ' +
			'RETURN a',
			{
				code: parseInt(code),
				username: username,
				newCode: update.newCode,
				newName: update.newName
			}
		)
		.then((result)=>{
			session.close();
			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			callback(null, node.properties);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

// DELETE

module.exports.moveToArchive = function (username, code, callback){
	session
		.run(
			'MATCH (a:Item {code: $code})-[r:IN_STOCK]-(b:User {username: $username}) ' +
			'MERGE (a)-[:ARCHIVED]-(b) ' +
			'DELETE r',
			{
				code: parseInt(code),
				username: username
			}
		)
		.then((result)=>{
			session.close();
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}