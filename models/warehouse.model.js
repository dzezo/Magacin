var redis = require('../config/redis/dbUtils');

var client = redis.getClient();

// POST

module.exports.AddItems = function(username, items, callback) {
	items.forEach((item)=>{
		// user:name:warehouse itemName
		client.sadd('user:' + username + ':warehouse', item.name, (err, newItem)=>{
			if(err){
				console.log(err);
				return callback(err);
			}
			if(newItem){
				// user:name:codes itemCode itemName
				client.hset('user:' + username + ':codes', item.code, item.name, (err, reply)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
					// user:name:itemName code itemCode name itemName purchaseP itemPurchaseP sellingP itemSellingP count 1
					client.hmset('user:' + username + ':' + item.name, [
						'code', item.code,
						'name', item.name, 
						'purchaseP', item.purchaseP, 
						'sellingP', item.sellingP,
						'count', 1
					], (err, reply)=>{
						if(err){
							console.log(err);
							return callback(err);
						}
					});
				});
			}
			else{
				client.hincrby('user:' + username + ':' + item.name, 'count', 1, (err, reply)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
				});
			}
		});
	});
	// RETURN
	return callback(null);
}

// GET

module.exports.searchForItem = function(username, searchString, callback) {
	searchPattern = ignoreCasePattern(searchString);
	client.sscan('user:' + username + ':warehouse', 0, 'MATCH', searchPattern, 'COUNT', 1000, (err, suggestion)=>{
		if(err){
			console.log(err);
			callback(err, null);
		}
		callback(null, suggestion[1]);
	});
}

module.exports.getItemCode = function(username, code, callback) {
	client.hget('user:' + username + ':codes', code, (err, itemName)=>{
		if(err){
			console.log(err);
			callback(err, null);
		}
		client.hgetall('user:' + username + ':' + itemName, (err, item)=>{
			if(err){
				console.log(err);
				callback(err, null);
			}
			callback(null, item);
		});
	});
}

module.exports.getItemName = function(username, itemName, callback) {
	client.hgetall('user:' + username + ':' + itemName, (err, item)=>{
		if(err){
			console.log(err);
			callback(err, null);
		}
		callback(null, item);
	});
}

// DELETE

module.exports.deleteItem = function(username, itemName, callback) {
	deleteItem(username, itemName, (err)=>{
		if(err)
			callback(err);
		callback(null);
	});
}

module.exports.undoItem = function(username, itemName, callback) {
	client.sismember('user:' + username + ':warehouse', itemName, (err, exists)=>{
		if(exists)
			client.hincrby('user:' + username + ':' + itemName, 'count', -1, (err, reply)=>{
				if(err){
					console.log(err);
					callback(err);
				}
				if(reply == 0){
					deleteItem(username, itemName, (err)=>{
						if(err)
							callback(err);
						callback(null);
					});
				}
				else
					callback(null);
			});
		else
			callback("ERR - Not found");
	});
}

// PUT

module.exports.updateItem = function(username, itemName, update, callback) {
	// delete from set
	client.srem('user:' + username + ':warehouse', itemName, (err,reply)=>{
		if(err){
			console.log(err);
			return callback(err);
		}
		// get code,purchaseP, sellingP & count
		client.hmget('user:' + username + ':' + itemName, 'code', 'purchaseP', 'sellingP', 'count', (err, oldItem)=>{
			if(err){
				console.log(err);
				return callback(err);
			}
			// delete from hash
			client.del('user:' + username + ':' + itemName, (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
			});
			// delete from codes
			client.hdel('user:' + username + ':codes', oldItem[0], (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
			});

			// Add update
			client.sadd('user:' + username + ':warehouse', update.newName, (err, newItem)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
			});
			// user:name:codes itemCode itemName
			client.hset('user:' + username + ':codes', update.newCode, update.newName, (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
			});
			// user:name:itemName code itemCode name itemName purchaseP itemPurchaseP sellingP itemSellingP count 1
			client.hmset('user:' + username + ':' + update.newName, [
				'code', update.newCode,
				'name', update.newName, 
				'purchaseP', oldItem[1], 
				'sellingP', oldItem[2],
				'count', oldItem[3]
			], (err, reply)=>{
				if(err){
					console.log(err);
					return callback(err);
				}
				return callback(null);
			});
		});
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

function deleteItem(username, itemName, callback){
	// delete from set
	client.srem('user:' + username + ':warehouse', itemName, (err,reply)=>{
		if(err){
			console.log(err);
			callback(err);
		}
		// get code
		client.hget('user:' + username + ':' + itemName, 'code', (err, code)=>{
			if(err){
				console.log(err);
				callback(err);
			}
			// delete from hash
			client.del('user:' + username + ':' + itemName, (err, reply)=>{
				if(err){
					console.log(err);
					callback(err);
				}
				// delete from codes
				client.hdel('user:' + username + ':codes', code, (err, reply)=>{
					if(err){
						console.log(err);
						callback(err);
					}
					callback(null);
				});
			});
		});
	});
}