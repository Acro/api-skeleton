#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var migrate = require("pg-migrator/migrate")
var co = require("co")
var parallel = require("co-parallel")
var fs = require("fs")
var dotenv = require("dotenv")

//var envs = [".env"]
//var envs = [".env-heroku-staging"]
//var envs = [".env-heroku-production"]
//var envs = [".env", ".env-heroku-dev", ".env-heroku-dev-testflight", ".env-heroku-dev-enterprise"]

var migrateEnv = function* (env) {

	var file = fs.readFileSync(__dirname + "/" + env)
	var config = dotenv.parse(file)

	var cs = config.PG_URL ? config.PG_URL : `postgres://${config.PG_USER}:${config.PG_PASS}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DB}?ssl=${config.PG_SSL}`

	yield migrate({connectionString: cs, path: "./migrations"})

	console.log(env, "migrated")
}

co(function* () {

	var jobs = envs.map(migrateEnv)

	yield parallel(jobs, 1)

	process.exit(0)
}).catch(function(e) {
	console.log(e)
	process.exit(1)
})

