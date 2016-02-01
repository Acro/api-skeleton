#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

//require("dotenv").load({path: ".env", silent: true})
require("dotenv").load({path: ".env-test", silent: true})

var migrate = require("pg-migrator/migrate")
var co = require("co")

var connectionString = function() {
	return process.env.PG_URL
}

var exitWithError = function() {
	process.exit(1)
}

co(function *() {

	yield migrate({
		connectionString: connectionString(),
		targetVersion: "1",
		path: "./migrations"
	}).catch(exitWithError)

	yield migrate({
		connectionString: connectionString(),
		path: "./migrations"
	}).catch(exitWithError)

}).then(process.exit).catch(exitWithError)

