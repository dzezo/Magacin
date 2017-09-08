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
			// user:name:supplier name supplier taxId 000111222
			client.hmset('user:' + username + ':' + supplier.name, 'name', supplier.name, 'taxId', supplier.taxId, (err, reply)=>{
				if(err){
					console.log(err);
					callback(err, "Dodavanje dobavljaca neuspesno");
				}
				callback(null, "Dodavanje dobavljaca uspesno");
			});
		}
		else
			callback(null, "Dobavljac vec postoji")
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
		callback(null, supplier);
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
			return callback(null,results);
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
	client.srem('user:' + username + ':suppliers', supplierName, (err, reply)=>{
		if(err){
			console.log(err);
			callback(err);
		}
		client.del('user:' + username + ':' + supplierName, (err, reply)=>{
			if(err){
				console.log(err);
				callback(err);
			}
			callback(null);
		});
	});
}

// OTHER

function ignoreCasePattern(searchString){
	var pattern = '';
	for(var i=0; i<searchString.length; i++){
		pattern = pattern + '[' + searchString[i].toLowerCase() + searchString[i].toUpperCase() + ']*'
	}
	return pattern;
}