"use strict"

var sessionModelFactory = function (db) {

	var model = {}

	model.create = function* (user_id, token, expires_at) {

		if (!expires_at) {
			throw new Error("Missing expires_at attribute")
		}

		return yield db.query([
			"INSERT INTO user_tokens (user_id, token, expires_at)",
			"VALUES (?, ?, to_timestamp(?))", user_id, token, expires_at
		])

	}

	return model

}

// @autoinject
module.exports.session = sessionModelFactory
