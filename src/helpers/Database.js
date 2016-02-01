"use strict"

var pg = require("pg")
var _ = require("lodash")

var postgresHelperFactory = function (config) {

	pg.defaults.poolSize = config.pg.pool_size
	var copg = require("co-pg")(pg)

	// expose public methods
	var helper = {}

	helper.build = require("simple-builder").pg

	helper.disconnect = function() {
		pg.end()
	}

	helper.query = function* (query, unescaped_values) {

		if (query && query.constructor === Array && !unescaped_values) {
			var built = helper.build(query)
			query = built.text
			unescaped_values = built.values
		}
		
		var result, connection, returnToPool

		try {

			var connection_results = yield copg.connectPromise(config.pg.url)
			connection = connection_results[0]
			returnToPool = connection_results[1]
			result = yield connection.queryPromise(query, unescaped_values)

			return result.rows

		} catch (e) {
			throw e
		} finally {
			if (returnToPool) {
				returnToPool()
			}
		}
	}

	helper.createClient = function() {
		return new copg.Client(config.pg)
	}

	helper.filterFields = function(data, keys) {

		return Object.keys(data).reduce(function(filtered, current) {

			if (_.contains(keys, current)) {
				filtered[current] = data[current]
			}

			return filtered

		}, {})
		
	}

	helper.formatDate = function(date) {
		return date.toISOString()
	}

	return helper
}

// @autoinject
module.exports.db = postgresHelperFactory

