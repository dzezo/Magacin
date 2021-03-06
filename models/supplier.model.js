var redis = require('../config/redis/dbUtils');

var client = redis.getClient();

// POST

module.exports.addSupplier = function(username, supplier, callback){
	// user:name:suppliers supplier
	client.sadd('user:' + username + ':suppliers', supplier.name, (err, newSupplier)=>{
		if(err){
			console.log(err);
			callback(err, "Dodavanje dobavljaca neuspesno");
		}
		if(newSupplier){
			// user:name:supplier name supplier taxId 000111222 collabCount 0
			client.hmset('user:' + username + ':' + supplier.name, 'name', supplier.name, 'taxId', supplier.taxId, 'collabCount', 0, (err, reply)=>{
				if(err){
					console.log(err);
					callback(err, "Dodavanje dobavljaca neuspesno");
				}
				callback(null, "Dodavanje dobavljaca uspesno");
			});
		}
		else
			callback("ERR - Allready exists", "Dobavljac vec postoji");
	});
}

module.exports.addSupplierFromInvoice = function(username, supplier, callback){
	// user:name:suppliers supplier
	client.sadd('user:' + username + ':suppliers', supplier.name, (err, newSupplier)=>{
		if(err){
			console.log(err);
			return callback(err);
		}
		if(newSupplier){
			// user:name:supplier name supplier taxId 000111222 collabCount 0
			client.hmset('user:' + username + ':' + supplier.name, 'name', supplier.name, 'taxId', supplier.taxId, 'collabCount', 1, (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
				return callback(null);
			});
		}
		else{
			client.hincrby('user:' + username + ':' + supplier.name, 'collabCount', 1, (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
			});
			// UPDATE TAXID ALLOWED
			client.hset('user:' + username + ':' + supplier.name, 'taxId', supplier.taxId, (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
			});
			// RETURN BACK
			return callback(null);
		}
	});
}

// GET

module.exports.searchSupplier = function(username, searchString, callback){
	searchPattern = ignoreCasePattern(searchString);
	client.sscan('user:' + username + ':suppliers', 0, 'MATCH', searchPattern, 'COUNT', 1000, (err, suggestion)=>{
		if(err){
			console.log(err);
			callback(err, null);
		}
		callback(null, suggestion[1]);
	});
}

module.exports.getSupplier = function(username, supplierName, callback){
	client.hgetall('user:' + username + ':' + supplierName, (err, supplier)=>{
		if(err){
			console.log(err);
			callback(err, null);
		}
		if(supplier)
			callback(null, supplier);
		else
			callback("ERR - None found", null);
	});
}

module.exports.getSuppliers = function(username, callback){
	var result = new Array();
	client.smembers('user:' + username + ':suppliers', (err, suppliers)=>{
		if(err){
			console.log(err);
			return callback(err, null);
		}
		if (suppliers.length == 0)
			return callback(null,result);
		suppliers.forEach((supplier)=>{
			client.hgetall('user:' + username + ':' + supplier, (err, supplierInfo)=>{
				if(err){
					console.log(err);
					return callback(err, null);
				}
				result.push(supplierInfo);
				if(suppliers.length == result.length)
					return callback(null, result);
			});
		});
	});
}

// DELETE

module.exports.deleteSupplier = function(username, supplierName, callback){
	// remove from set
	client.srem('user:' + username + ':suppliers', supplierName, (err, reply)=>{
		if(err){
			console.log(err);
			callback(err);
		}
		// remove hash
		client.del('user:' + username + ':' + supplierName, (err, reply)=>{
			if(err){
				console.log(err);
				callback(err);
			}
			callback(null);
		});
	});
}

module.exports.undoSupplier = function(username, supplierName, callback){
	client.hincrby('user:' + username + ':' + supplierName, 'collabCount', -1, (err, reply)=>{
		if(err){
			console.log(err);
			callback(err);
		}
		if(reply == 0){
			// remove from set
			client.srem('user:' + username + ':suppliers', supplierName, (err, reply)=>{
				if(err){
					console.log(err);
					callback(err);
				}
				// remove hash
				client.del('user:' + username + ':' + supplierName, (err, reply)=>{
					if(err){
						console.log(err);
						callback(err);
					}
					callback(null);
				});
			});
		}
		else
			callback(null);
	});
}

// OTHER

function ignoreCasePattern(searchString){
	var pattern = '*';
	for(var i=0; i<searchString.length; i++){
		pattern = pattern + '[' + searchString[i].toLowerCase() + searchString[i].toUpperCase() + ']'
	}
	return pattern = pattern + '*';
}