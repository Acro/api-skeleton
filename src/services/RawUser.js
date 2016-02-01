"use strict"

var rawUserModelFactory = function (db) {

	const TABLE = "users"

	var model = {}

	model.getUserByToken = function* (token) {

		var results = yield db.query([
			"SELECT * FROM", TABLE,
			"WHERE id = (SELECT user_id FROM user_tokens WHERE token = ?)", token
		])

		if (results.length !== 1) {
			return false
		}

		return results.pop()

	}

	return model
}

// @autoinject
module.exports.raw_user = rawUserModelFactory
