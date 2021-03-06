var redis = require('../config/redis/dbUtils');

var client = redis.getClient();

// POST

module.exports.AddItems = function(username, items, callback) {
	var added = 0; // Count returned items
	var errors = 0
	items.forEach((item)=>{
		add(username, item, (err)=>{
			++added;
			if(err){
				++errors;
			}
			// If all items returned check for error
			if(added === items.length){
				if(errors)
					callback(err);
				else
					callback(null);
			}
		});
	});
}

function add(username, item, callback){
	// Add can be called after undo which means that archived items can be on the list, and if so ignore them
	// If its not called after undo then argument oldName is undefined
	if(item.oldName){
		client.sismember('user:' + username + ':archive', item.oldName, (err, exists)=>{
			if(err){
				console.log(err);
				return callback(err);
			}
			else if(!exists){
				// Returns nil or itemName
				client.hget('user:' + username + ':codes', item.code, (err, oldName)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
					// New item
					else if(!oldName){
						client.sadd('user:' + username + ':warehouse', item.name, (err, newItem)=>{
							if(err){
								console.log(err);
								return callback(err);
							}
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
									else
										return callback(null);
								});
							});
						});
					}
					else if(item.name == oldName){
						client.hincrby('user:' + username + ':' + item.name, 'count', 1, (err, reply)=>{
							if(err){
								console.log(err);
								return callback(err);
							}
							// Update item
							client.hmset('user:' + username + ':' + item.name, [
								'purchaseP', item.purchaseP, 
								'sellingP', item.sellingP,
							], (err, reply)=>{
								if(err){
									console.log(err);
									return callback(err);
								}
								else
									return callback(null);
							});
						});
					}
					// Name change
					else{
						client.srem('user:' + username + ':warehouse', oldName, (err,reply)=>{
							if(err){
								console.log(err);
								return callback(err);
							}
							// Update codes
							client.hset('user:' + username + ':codes', item.code, item.name, (err, reply)=>{
								if(err){
									console.log(err);
									return callback(err);
								}
								client.sadd('user:' + username + ':warehouse', item.name, (err, newItem)=>{
									if(err){
										console.log(err);
										return callback(err);
									}
									// Renaming item hash
									client.rename('user:' + username + ':' + oldName, 'user:' + username + ':' + item.name, (err, reply)=>{
										if(err){
											console.log(err);
											return callback(err);
										}
										client.hincrby('user:' + username + ':' + item.name, 'count', 1, (err, reply)=>{
											if(err){
												console.log(err);
												return callback(err);
											}
											// Update item
											client.hmset('user:' + username + ':' + item.name, [
												'name', item.name,
												'purchaseP', item.purchaseP, 
												'sellingP', item.sellingP,
											], (err, reply)=>{
												if(err){
													console.log(err);
													return callback(err);
												}
												else
													return callback(null);
											});
										});
									});
								});
							});
						});
					}
				});
			}
			else if(exists){
				// Remove from tmp archive=
				client.srem('user:' + username + ':archive', item.oldName, (err,reply)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
					else
						callback(null);
				});				
			}
		});
	}
	else{
		// Returns nil or itemName
		client.hget('user:' + username + ':codes', item.code, (err, oldName)=>{
			if(err){
				console.log(err);
				return callback(err);
			}
			// New item
			else if(!oldName){
				client.sadd('user:' + username + ':warehouse', item.name, (err, newItem)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
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
							else
								return callback(null);
						});
					});
				});
			}
			else if(item.name == oldName){
				client.hincrby('user:' + username + ':' + item.name, 'count', 1, (err, reply)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
					// Update item
					client.hmset('user:' + username + ':' + item.name, [
						'purchaseP', item.purchaseP, 
						'sellingP', item.sellingP,
					], (err, reply)=>{
						if(err){
							console.log(err);
							return callback(err);
						}
						else
							return callback(null);
					});
				});
			}
			// Name change
			else{
				client.srem('user:' + username + ':warehouse', oldName, (err,reply)=>{
					if(err){
						console.log(err);
						return callback(err);
					}
					// Update codes
					client.hset('user:' + username + ':codes', item.code, item.name, (err, reply)=>{
						if(err){
							console.log(err);
							return callback(err);
						}
						client.sadd('user:' + username + ':warehouse', item.name, (err, newItem)=>{
							if(err){
								console.log(err);
								return callback(err);
							}
							// Renaming item hash
							client.rename('user:' + username + ':' + oldName, 'user:' + username + ':' + item.name, (err, reply)=>{
								if(err){
									console.log(err);
									return callback(err);
								}
								client.hincrby('user:' + username + ':' + item.name, 'count', 1, (err, reply)=>{
									if(err){
										console.log(err);
										return callback(err);
									}
									// Update item
									client.hmset('user:' + username + ':' + item.name, [
										'name', item.name,
										'purchaseP', item.purchaseP, 
										'sellingP', item.sellingP,
									], (err, reply)=>{
										if(err){
											console.log(err);
											return callback(err);
										}
										else
											return callback(null);
									});
								});
							});
						});
					});
				});
			}
		});
	}
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

// PUT

module.exports.undoItems = function(username, items, callback) {
	if(items){
		var removed = 0; // Count returned items
		var errors = 0
		items.forEach((item)=>{
			undo(username, item.name, (err)=>{
				++removed;
				if(err){
					++errors;
				}
				// If all items returned check for error
				if(removed === items.length){
					if(errors)
						callback(err);
					else
						callback(null);
				}
			});
		});
	}
	else{
		// NO ITEMS
		return callback(null);
	}
}

function undo(username, itemName, callback){
	client.sismember('user:' + username + ':warehouse', itemName, (err, exists)=>{
		if(err)
			callback(err);
		if(exists){
			// Disconnect input invoice
			client.hincrby('user:' + username + ':' + itemName, 'count', -1, (err, reply)=>{
				if(err)
					callback(err);
				// If there is no other input invoice connected to item then delete item
				if(reply == 0){
					deleteItem(username, itemName, (err)=>{
						if(err)
							callback(err);
						else
							callback(null);
					});
				}
				else
					callback(null)
			});
		}
		// ARCHIVED ITEM
		else{
			client.sadd('user:' + username + ':archive', itemName, (err, reply)=>{
				if(err)
					callback(err);
				else
					callback(null);
			});
		}
	});
}

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