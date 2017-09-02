var neo4j = require('neo4j-driver').v1;
var config = require('../config/database');

// Database
var driver = neo4j.driver(config.database, neo4j.auth.basic(config.username, config.password));
var session = driver.session();

// GET
// POST

module.exports.addInputInvoice = function (username, newInvoice, callback) {
	session
		.run(
			'MERGE (a: User {username: $username}) ' +
			'MERGE (b: Invoice {supplier: $supplier, taxId: $taxId, refNumber: $refNumber, invNumber: $invNumber, recvDate: $recvDate, expDate: $expDate, total: $total}) ' +
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

			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			inputItems(username, newInvoice.invNumber, newInvoice.items);
			callback(null, node.properties);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

// INPUT ITEMS AND CONNECT THEM WITH INVOICE
function inputItems(username, invNumber, items){
	items.forEach((item) =>{

		inputItem(username, item);

		session
			.run(
				'MERGE (a: Invoice {invNumber: $invNumber}) ' +
				'MERGE (b: Item {code: $code}) ' +
				'MERGE (a)-[r:IN {quantity: $quantity, purchaseP: $purchaseP, sellingP: $sellingP}]-(b)',
				{
					// Invoice node
					invNumber: invNumber,
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

	});
}

function inputItem(username, item){
	session
		.run(
			'MERGE (a:User {username: $username}) ' +
			'MERGE (b:Item {code: $code}) ' + 
			'ON CREATE SET b.name= $name, b.quantity= $quantity, b.purchaseP= $purchaseP, b.sellingP= $sellingP ' +
			'ON MATCH SET b.quantity = b.quantity + $quantity, b.purchaseP= $purchaseP, b.sellingP= $sellingP ' +
			'MERGE (a)-[r:INSTOCK]-(b)',
			{
				// USER NODE
				username: username,
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

module.exports.addOutputInvoice = function (username, newInvoice, callback) {
	session
		.run(
			'MERGE (a: User {username: $username}) ' +
			'MERGE (b: Invoice {purchaser: $purchaser, invNumber: $invNumber, issueDate: $issueDate, total: $total}) ' +
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

			var singleRecord = result.records[0];
			var node = singleRecord.get(0);
			outputItems(username, newInvoice.invNumber, newInvoice.items);
			callback(null, node.properties);
		})
		.catch((err)=>{
			session.close();
			console.log(err);
			callback(err, null);
		});
}

// OUTPUT ITEMS AND CONNECT THEM WITH INVOICE
function outputItems(username, invNumber, items){
	items.forEach((item) =>{

		outputItem(username, item);

		session
			.run(
				'MERGE (a: Invoice {invNumber: $invNumber}) ' +
				'MERGE (b: Item {code: $code}) ' +
				'MERGE (a)-[r:OUT {quantity: $quantity, sellingP: $sellingP}]-(b)',
				{
					// Invoice node
					invNumber: invNumber,
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

	});
}

function outputItem(username, item){
	session
		.run(
			'MERGE (a:User {username: $username}) ' +
			'MERGE (b:Item {code: $code}) ' + 
			'ON CREATE SET b.name= $name, b.quantity= $quantity, b.sellingP= $sellingP ' +
			'ON MATCH SET b.quantity = b.quantity - $quantity ' +
			'MERGE (a)-[r:INSTOCK]-(b)',
			{
				// USER NODE
				username: username,
				// ITEM NODE
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

// PUT
// DELETE