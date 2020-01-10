var redis = require('redis');
var config = require('./dbConfig');

// Redis client
var client = redis.createClient(config);
// Register a callback to know if connection was successful
client.on('connect', function(){
	console.log('Connected to redis')
});
// This could happen due to wrong credentials or database unavailability
client.on("error", function (err) {
    console.log("Redis connection failed: " + err);
});

module.exports.getClient = function(){
	return client;
}