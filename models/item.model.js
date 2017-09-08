var neo4j = require('../config/neo4j/dbUtils');

var session = neo4j.getSession();

// GET

module.exports.getItem = function (itemId, callback){
	session
		.run(
			'MATCH (a:Item)-[]-(:User) WHERE ID(a)=$itemId ' +
			'WITH a ' +
			'MATCH (b)-[r1:IN]-(a) ' +
			'WITH a, COLLECT({rel: r1, inv: b}) AS INPUT ' +
			'MATCH (a)-[r2:OUT]-(c) ' +
			'WITH a, INPUT, COLLECT({rel: r2, inv: c}) AS OUTPUT ' +
			'RETURN a, INPUT, OUTPUT',
			{
				itemId: neo4j.int(itemId)
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
			'MATCH (a:User {username: $username})-[r:WAREHOUSE]-(b:Item) ' +
			'RETURN { id: toString(ID(b)), code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP } AS ITEM',
			{ 
				username: username
			}
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
			'RETURN { id: toString(ID(b)), code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP } AS ITEM',
			{ username: username }
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

// DELETE

module.exports.moveToArchive = function (itemId, callback){
	session
		.run(
			'MATCH (itm:Item)-[r:WAREHOUSE]-(u:User) WHERE ID(itm)=$itemId ' +
			'MERGE (itm)-[:ARCHIVED]-(u) ' +
			'DELETE r',
			{
				itemId: neo4j.int(itemId)
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

// PUT

module.exports.updateItem = function(itemId, update, callback){
	session
		.run(
			'MATCH (itm:Item) WHERE ID(itm)=$itemId ' +
			'SET itm.code = $newCode, itm.name = $newName ' +
			'RETURN itm',
			{
				itemId: neo4j.int(itemId),
				newCode: update.newCode,
				newName: update.newName
			}
		)
		.then((result)=>{
			session.close();
			var updatedItem = result.records[0].get(0);
			console.log(updatedItem);
			console.log(updateItem.properties);
			//callback(null, updatedItem);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}