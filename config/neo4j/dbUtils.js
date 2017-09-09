var neo4j = require('neo4j-driver').v1;
var config = require('./dbConfig');

// Neo4j database driver
var driver = neo4j.driver(config.database, neo4j.auth.basic(config.username, config.password));
// Register a callback to know if driver creation was successful
driver.onCompleted = function () {
	console.log('Connected to Neo4j');
};
// This could happen due to wrong credentials or database unavailability
driver.onError = function (error) {
	console.log('Neo4j connection failed: ', error);
};

module.exports.getSession = function(){
	return driver.session();
}

module.exports.getDriver = function(){
	return neo4j;
}