var Neo4j = require('../config/neo4j/dbUtils');

var neo4j = Neo4j.getDriver();
var session = Neo4j.getSession();

// GET

// ii - input invoice, oi - output invoice
module.exports.getItem = function (itemId, callback){
	session
		.run(
			'MATCH (itm:Item)-[]-(:User) WHERE ID(itm)=$itemId ' +
			'WITH itm ' +
			'MATCH (ii)-[in:IN]-(itm) ' +
			'WITH itm, in, {rel: in, inv: {id: toString(ID(ii)), supplier: ii.supplier, invNumber: ii.invNumber}} AS INPUT ' +
			'OPTIONAL MATCH (itm)-[out:OUT]-(oi) ' +
			'WITH itm, in, out, INPUT, {rel: out, inv: {id: toString(ID(oi)), purchaser: oi.purchaser, invNumber: oi.invNumber, issueDate: oi.issueDate}} AS OUTPUT ' +
			'ORDER BY OUTPUT.inv.issueDate DESC ' +
			'RETURN itm, ' +
				'CASE WHEN in IS NOT NULL THEN ' +
					'COLLECT(DISTINCT INPUT) ELSE ' +
					'NULL END, ' +
				'CASE WHEN out IS NOT NULL THEN ' +
					'COLLECT(DISTINCT OUTPUT) ELSE ' +
					'NULL END',
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
			
			if(inputs){
				inputs.forEach((input)=>{
					itemProfile.inputs.push({
						in: input.rel.properties,
						// Invoice details
						details: input.inv
					});
				});
			}

			if(outputs){
				outputs.forEach((output)=>{
					itemProfile.outputs.push({
						out: output.rel.properties,
						// Invoice details
						details: output.inv
					});
				});
			}

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
			'RETURN { id: toString(ID(b)), code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP } AS ITEM ' +
			'ORDER BY b.code',
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
			'RETURN { id: toString(ID(b)), code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP } AS ITEM ' +
			'ORDER BY b.code',
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
			callback(null, updatedItem.properties);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}