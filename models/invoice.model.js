var Neo4j = require('../config/neo4j/dbUtils');

var neo4j = Neo4j.getDriver();
var session = Neo4j.getSession();

// GET

module.exports.getInputInvoices = function (username, callback){
	session
		.run(
			'MATCH (a:Invoice)-[r:INPUT]-(b:User {username: $username}) ' +
			'RETURN { id: toString(ID(a)), supplier: a.supplier, invNumber: a.invNumber, total: a.total, recvDate: a.recvDate, expDate: a.expDate } AS INVOICE ' +
			'ORDER BY a.expDate',
			{ username: username }
		)
		.then((result)=>{
			session.close();
			var invoices = [];
			for(var i=0; i<result.records.length; i++)
			{
				invoices.push(result.records[i].get(0));
			}
			callback(null, invoices);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

module.exports.getOutputInvoices = function (username, callback){
	session
		.run(
			'MATCH (a:Invoice)-[r:OUTPUT]-(b:User {username: $username}) ' +
			'RETURN { id: toString(ID(a)), purchaser: a.purchaser, invNumber: a.invNumber, total: a.total, issueDate: a.issueDate } AS INVOICE ' +
			'ORDER BY a.issueDate DESC',
			{ username: username }
		)
		.then((result)=>{
			session.close();
			var invoices = [];
			for(var i=0; i<result.records.length; i++)
			{
				invoices.push(result.records[i].get(0));	
			}
			callback(null, invoices);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

module.exports.getInputInvoice = function (invoiceId, callback){
	session
		.run(
			'MATCH (inv:Invoice) WHERE ID(inv)=$invId ' +
			'OPTIONAL MATCH (inv)-[in:IN]-(itm:Item) ' +
			'WITH inv, itm, {code: itm.code, name: itm.name, quantity: in.quantity, purchaseP: in.purchaseP, sellingP: in.sellingP} AS item '+
			'RETURN {invoice: inv, items: CASE WHEN itm IS NOT NULL THEN COLLECT(item) ELSE NULL END}', 
			{
				invId: neo4j.int(invoiceId)
			}
		)
		.then((result)=>{
			session.close();

			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			var invoice = node.invoice.properties;
			invoice.items = node.items;
			callback(null, invoice);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

module.exports.getOutputInvoice = function (invoiceId, callback){
	session
		.run(
			'MATCH (a:Invoice) WHERE ID(a)=$invId ' +
			'OPTIONAL MATCH (a)-[r:OUT]-(b:Item) ' +
			'WITH a, b, {code: b.code, name: b.name, quantity: r.quantity, sellingP: r.sellingP} AS ITEM '+
			'RETURN {invoice: a, items: CASE WHEN b IS NOT NULL THEN COLLECT(ITEM) ELSE NULL END}', 
			{
				invId: neo4j.int(invoiceId)
			}
		)
		.then((result)=>{
			session.close();
			
			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			var invoice = node.invoice.properties;
			invoice.items = node.items;
			callback(null, invoice)
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

// POST

// IN
module.exports.addInputInvoice = function (username, newInvoice, callback) {
	session
		.run(
			'MATCH (a:User {username: $username}) ' +
			'CREATE (b:Invoice {supplier: $supplier, taxId: $taxId, refNumber: $refNumber, invNumber: $invNumber, recvDate: $recvDate, expDate: $expDate, total: $total}) ' +
			'MERGE (a)-[r:INPUT]-(b) ' +
			'RETURN b',
			{
				// INVOICE NODE
				supplier: newInvoice.supplier,
				taxId: newInvoice.taxId,
				refNumber: newInvoice.refNumber,
				invNumber: newInvoice.invNumber,
				recvDate: newInvoice.recvDate,
				expDate: newInvoice.expDate,
				total: newInvoice.total,
				// USER NODE
				username: username
			}
		)
		.then((result)=>{
			session.close();
			var createdInvoice = result.records[0].get(0);
			newInvoice.items.forEach((item)=>{
				session
					.run(
						'MATCH (u:User {username: $username}) ' +
						'MATCH (inv:Invoice) WHERE ID(inv)=$invId ' +
						'MERGE (u)-[:WAREHOUSE]-(itm:Item {code: $code}) ' +
						'ON CREATE SET itm.name= $name, itm.quantity= $quantity, itm.purchaseP= $purchaseP, itm.sellingP= $sellingP ' +
						'ON MATCH SET itm.name= $name, itm.quantity= itm.quantity + $quantity, itm.purchaseP= $purchaseP, itm.sellingP= $sellingP ' +
						'MERGE (inv)-[r:IN {quantity: $quantity, purchaseP: $purchaseP, sellingP: $sellingP}]-(itm) ' +
						'ON CREATE SET r.timestamp = timestamp()',
						{
							// USER NODE
							username: username,
							// INVOICE NODE
							invId: createdInvoice.identity,
							// ITEM NODE
							code: item.code,
							name: item.name,
							quantity: item.quantity, 
							purchaseP: item.purchaseP, 
							sellingP: item.sellingP
						}
					)
					.then((result)=>{
						session.close();
					})
					.catch((err)=>{
						session.close();
						console.log(err);

						callback(err);
					});
			});

			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);

			callback(err);
		});
}

// OUT
module.exports.addOutputInvoice = function (username, newInvoice, callback) {
	session
		.run(
			'MATCH (a:User {username: $username}) ' +
			'CREATE (b:Invoice {purchaser: $purchaser, invNumber: $invNumber, issueDate: $issueDate, total: $total}) ' +
			'MERGE (a)-[r:OUTPUT]-(b) ' +
			'RETURN b',
			{
				// INVOICE NODE
				purchaser: newInvoice.purchaser,
				invNumber: newInvoice.invNumber,
				issueDate: newInvoice.issueDate,
				total: newInvoice.total,
				// USER NODE
				username: username
			}
		)
		.then((result)=>{
			session.close();
			var createdInvoice = result.records[0].get(0);
			newInvoice.items.forEach((item)=>{
				session
					.run(
						'MATCH (:User {username: $username})-[:WAREHOUSE]-(itm:Item {code: $code}) ' +
						'MATCH (inv:Invoice) WHERE ID(inv)=$invId ' +
						'SET itm.quantity = itm.quantity - $quantity ' +
						'MERGE (inv)-[:OUT {quantity: $quantity, sellingP: $sellingP}]-(itm)',
						{
							// USER NODE
							username: username,
							// INVOICE NODE
							invId: createdInvoice.identity,
							// ITEM NODE
							code: item.code,
							name: item.name,
							quantity: item.quantity,
							sellingP: item.sellingP
						}
					)
					.then((result)=>{
						session.close();
					})
					.catch((err)=>{
						session.close();
						console.log(err);

						callback(err);
					});
			});
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}

// DELETE

module.exports.undoInputInvoice = function (invoiceId, callback){
	// DELETE INVOICE & RETURN ITEMS
	session
		.run(
			'MATCH (:User)-[mr:INPUT]-(inv:Invoice) WHERE ID(inv)=$invId ' +
			'OPTIONAL MATCH (itm:Item)-[in:IN]-(inv) ' +
			'SET itm.quantity = itm.quantity - in.quantity ' +
			'WITH mr,inv,in,itm ' +
			'OPTIONAL MATCH (oinv:Invoice)-[oin:IN]-(itm) WHERE ID(oinv)<>$invId ' +
			'WITH mr,inv,in,{id: ID(itm), rels: COLLECT(oin)} AS items ' +
			'DELETE mr,in,inv ' +
			'RETURN COLLECT(DISTINCT items)',
			{
				invId: neo4j.int(invoiceId)
			}
		)
		.then((result)=>{
			session.close();
			// itemArr [{ id, rel [ {} ] }]
			var itemArr = result.records[0].get(0);
			if(itemArr[0].id)
				undoInputItems(itemArr);
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}

function undoInputItems(items){
	items.forEach((item)=>{
		arrOfRels = item.rels;
		if(arrOfRels.length > 0){
			// FIND LATEST RELATIONSHIP
			var latest = arrOfRels[0].properties;
			for(var i=1; i<arrOfRels.length; i++){
				if(latest.timestamp < arrOfRels[i].properties.timestamp)
					latest = arrOfRels[i].properties;
			}
			// UPDATE ITEM WITH LATEST
			session
				.run(
					'MATCH (itm:Item) WHERE ID(itm)=$itmId SET itm.purchaseP = $latestPurchaseP, itm.sellingP = $latestSellingP',
					{ 
						itmId: item.id,
						latestPurchaseP: latest.purchaseP,
						latestSellingP: latest.sellingP
					}
				)
				.then((result)=>{
					session.close();
				})
				.catch((err)=>{
					session.close();
					console.log(err);
				});
		}
		else{
			// DELETE ITEM
			session
				.run(
					'MATCH (itm:Item)-[r]-() WHERE ID(itm)=$itmId AND NOT (itm)-[:OUT]-() ' +
					'delete r,itm', { itmId: item.id }
				)
				.then((result)=>{
					session.close();
				})
				.catch((err)=>{
					session.close();
					console.log(err);
				});
		}
	});
}

module.exports.undoOutputInvoice = function (invoiceId, callback){
	// ADD QUANTITY BACK AND DELETE
	session
		.run(
			'MATCH (inv:Invoice)-[r:OUTPUT]-(:User) WHERE ID(inv)=$invId ' +
			'OPTIONAL MATCH (inv)-[out:OUT]-(itm:Item) ' +
			'SET itm.quantity = itm.quantity + out.quantity ' +
			'WITH inv,r,out ' +
			'DELETE out,r,inv',
			{
				invId: neo4j.int(invoiceId)
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
module.exports.updateInputInvoice = function (invoiceId, newInvoice, callback) {
	session
		.run(
			'MATCH (b:Invoice) WHERE ID(b)=$invId ' +
			'SET b.supplier= $supplier, b.taxId= $taxId, b.refNumber= $refNumber, b.invNumber= $invNumber, b.recvDate= $recvDate, b.expDate= $expDate, b.total= $total',
			{
				// INVOICE NODE
				invId: neo4j.int(invoiceId),
				supplier: newInvoice.supplier,
				taxId: newInvoice.taxId,
				refNumber: newInvoice.refNumber,
				invNumber: newInvoice.invNumber,
				recvDate: newInvoice.recvDate,
				expDate: newInvoice.expDate,
				total: newInvoice.total,
			}
		)
		.then((result)=>{
			session.close();
			newInvoice.items.forEach((item)=>{
				session
					.run(
						'MATCH (inv:Invoice)-[r:IN]-(itm:Item {code: $code}) WHERE ID(inv)=$invId ' +
						'SET itm.name= $name, itm.quantity= itm.quantity + $quantity, r.quantity= $quantity, r.purchaseP= $purchaseP, r.sellingP= $sellingP',
						{
							// INVOICE NODE
							invId: neo4j.int(invoiceId),
							// ITEM NODE
							code: item.code,
							name: item.name,
							quantity: item.quantity, 
							purchaseP: item.purchaseP, 
							sellingP: item.sellingP
						}
					)
					.then((result)=>{
						session.close();
					})
					.catch((err)=>{
						session.close();
						console.log(err);

						callback(err);
					});
			});

			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);

			callback(err);
		});
}
