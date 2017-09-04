var neo4j = require('neo4j-driver').v1;
var config = require('../config/database');

// Database
var driver = neo4j.driver(config.database, neo4j.auth.basic(config.username, config.password));
var session = driver.session();

// GET

module.exports.getInputInvoices = function (username, callback){
	session
		.run(
			'MATCH (a:Invoice)-[r:INPUT]-(b:User) RETURN { id: ID(a), supplier: a.supplier, total: a.total, recvDate: a.recvDate, expDate: a.expDate } AS INVOICE'
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
			'MATCH (a:Invoice)-[r:OUTPUT]-(b:User) RETURN { id: ID(a), purchaser: a.purchaser, total: a.total, issueDate: a.issueDate } AS INVOICE'
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
			'MATCH (a:Invoice)-[r:HAS_ITEM]-(b:InvoiceItem) ' +
			'WHERE ID(a)=$invId ' + 
			'WITH a, {code: b.code, name: b.name, quantity: b.quantity, purchaseP: b.purchaseP, sellingP: b.sellingP} AS item '+
			'RETURN {invoice: a, items: COLLECT(item)}', 
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

module.exports.getOutputInvoice = function (invoiceId, callback){
	session
		.run(
			'MATCH (a:Invoice)-[r:HAS_ITEM]-(b:InvoiceItem) ' +
			'WHERE ID(a)=$invId ' + 
			'WITH a, {code: b.code, name: b.name, quantity: b.quantity, sellingP: b.sellingP} AS ITEM '+
			'RETURN {invoice: a, items: COLLECT(ITEM)}', 
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
			'MATCH (a: User {username: $username}) ' +
			'CREATE (b: Invoice {supplier: $supplier, taxId: $taxId, refNumber: $refNumber, invNumber: $invNumber, recvDate: $recvDate, expDate: $expDate, total: $total}) ' +
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
			// NODE - NEW INVOICE
			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			newInvoice.items.forEach((item)=>{
				connectInputItems(node.identity.low, item);
				inputUpdate(username, node.identity.low, item);
			});
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}

function connectInputItems(invId, item){
	session
		.run(
			'MATCH (a: Invoice) WHERE ID(a)=$invId ' +
			'CREATE (b: InvoiceItem {code: $code, name: $name, quantity: $quantity, purchaseP: $purchaseP, sellingP: $sellingP}) ' +
			'MERGE (a)-[r:HAS_ITEM]-(b)',
			{
				// Invoice node
				invId: invId,
				// Item node
				code: item.code,
				name: item.name,
				quantity: item.quantity, 
				purchaseP: item.purchaseP, 
				sellingP: item.sellingP
			}
		)
		.then(()=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}

function inputUpdate(username, invId, item){
	session
		.run(
			'MATCH (a:User {username: $username}) ' +
			'MATCH (b:Invoice) WHERE ID(b)=$invId ' +
			'MERGE (c:Item {code: $code}) ' + 
			'ON CREATE SET c.name= $name, c.quantity= $quantity, c.purchaseP= $purchaseP, c.sellingP= $sellingP ' +
			'ON MATCH SET c.quantity = c.quantity + $quantity, c.purchaseP= $purchaseP, c.sellingP= $sellingP ' +
			'MERGE (a)-[r1:IN_STOCK]-(c) ' +
			'MERGE (b)-[r2:IN {quantity: $quantity, purchaseP: $purchaseP, sellingP: $sellingP}]-(c) '+
			'ON CREATE SET r2.timestamp = timestamp()',
			{
				// USER NODE
				username: username,
				// INVOICE NODE
				invId: invId,
				// ITEM NODE
				code: item.code,
				name: item.name,
				quantity: item.quantity, 
				purchaseP: item.purchaseP, 
				sellingP: item.sellingP
			}
		)
		.then(()=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}

// OUT
module.exports.addOutputInvoice = function (username, newInvoice, callback) {
	session
		.run(
			'MATCH (a: User {username: $username}) ' +
			'CREATE (b: Invoice {purchaser: $purchaser, invNumber: $invNumber, issueDate: $issueDate, total: $total}) ' +
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
			// NODE - NEW INVOICE
			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			newInvoice.items.forEach((item)=>{
				connectOutputItems(node.identity.low, item);
				outputUpdate(node.identity.low, item);
			});
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}

function connectOutputItems(invId, item){
	session
		.run(
			'MATCH (a: Invoice) WHERE ID(a)=$invId ' +
			'CREATE (b: InvoiceItem {code: $code, name: $name, quantity: $quantity, sellingP: $sellingP}) ' +
			'MERGE (a)-[r:HAS_ITEM]-(b)',
			{
				// Invoice node
				invId: invId,
				// Item node
				code: item.code,
				name: item.name,
				quantity: item.quantity,
				sellingP: item.sellingP
			}
		)
		.then(()=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}

function outputUpdate(invId, item){
	session
		.run(
			'MATCH (a:Invoice) WHERE ID(a)=$invId ' +
			'MATCH (b:Item {code: $code}) SET b.quantity = b.quantity - $quantity ' +
			'MERGE (a)-[r:OUT {quantity: $quantity, sellingP: $sellingP}]-(b)',
			{
				// INVOICE NODE
				invId: invId,
				// ITEM NODE
				code: item.code,
				quantity: item.quantity,
				sellingP: item.sellingP
			}
		)
		.then(()=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}

// DELETE

module.exports.undoInputInvoice = function (invoiceId, callback){
	// RETURN CONNECTED ITEMS
	session
		.run(
			'MATCH (a:Invoice)-[r:IN]-(b:Item) WHERE ID(a)=$invId WITH b.code AS ITEM ' +
			'RETURN {items: COLLECT(ITEM)}',
			{invId: neo4j.int(invoiceId)}
		)
		.then((result)=>{
			session.close();
			var arrOfCodes = result.records[0].get(0).items;
			// IF INVOICE NOT EMPTY
			if(arrOfCodes.length > 0){
				subtractQuantityBack(invoiceId);
				undoInputUpdate(invoiceId, arrOfCodes);
			}
			// DELETE INVOICE
			undoInvoice(invoiceId);
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}

function undoInputUpdate(invoiceId, codes){
	// GET RELATIONSHIPS WITH OTHER INVOICES
	// AND UPDATE ITEM WITH LATEST DATA
	// IF NO RELATIONSHIPS DELETE ITEM
	codes.forEach((code)=>{
		session
			.run(
				'MATCH (a:Item {code: $code})-[r:IN]-(b:Invoice) WHERE ID(b)<>$invId ' +
				'WITH r AS relationship RETURN {relationships: collect(relationship)}',
				{
					invId: neo4j.int(invoiceId),
					code: code
				}
			)
			.then((result)=>{
				session.close();
				var arrOfRels = result.records[0].get(0).relationships;
				if(arrOfRels.length > 0)
					findLatestInvoice(code, arrOfRels);
				else
					deleteItem(code);
			})
			.catch((err)=>{
				session.close();
				console.log(err);
			});
	});
}

function subtractQuantityBack(invoiceId){
	session
		.run(
			'MATCH (a:Invoice)-[r:IN]-(b:Item) WHERE ID(a)=$invId SET b.quantity = b.quantity - r.quantity',
			{invId: neo4j.int(invoiceId)}
		)
		.then((result)=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}

function findLatestInvoice(code, relationships){
	var latest = relationships[0]
	for(var i=1; i<relationships.length; i++){
		if(latest.timestamp < relationships[i].timestamp)
			latest = relationships[i];
	}
	session
		.run(
			'MATCH (a:Item {code: $code}) SET a.purchaseP = $latestPurchaseP, a.sellingP = $latestSellingP',
			{ 
				code: code,
				latestPurchaseP: latest.properties.purchaseP,
				latestSellingP: latest.properties.sellingP
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

function deleteItem(code){
	session
		.run(
			'MATCH (a:Item {code: $code})-[r]-() DELETE r,a',{ code: code }
		)
		.then((result)=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}

module.exports.undoOutputInvoice = function (invoiceId, callback){
	// ADD QUANTITY BACK AND DELETE
	session
		.run(
			'MATCH (a:Invoice)-[r:OUT]-(b:Item) WHERE ID(a)=$invId ' +
			'SET b.quantity = b.quantity + r.quantity',
			{invId: neo4j.int(invoiceId)}
		)
		.then((result)=>{
			session.close();
			undoInvoice(invoiceId);
			callback(null);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err);
		});
}

function undoInvoice(invoiceId){
	session
		.run(
			'MATCH ()-[r1]-(a:Invoice) ' + 
			'WHERE ID(a)=$invId ' +
			'OPTIONAL MATCH ()-[r1]-(a:Invoice)-[r0:HAS_ITEM]-(b:InvoiceItem) ' +
			'DELETE r0,b,r1,a',  
			{invId: neo4j.int(invoiceId)}
		)
		.then((result)=>{
			session.close();
		})
		.catch((err)=>{
			session.close();
			console.log(err);
		});
}