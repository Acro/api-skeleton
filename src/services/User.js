"use strict"

var userModelFactory = function (db, hash, config, raw_user) {

	const TABLE = "users"

	var selection = [
		"id AS user_id",
		"username",
		"created_at"
	]

	var model = {}

	model.raw = raw_user

	model.create = function* (data) {

		if (data.password) {
			data.password = hash.get(data.password)
		}

		var allowed = [ "username", "email", "password" ]

		var insertion = db.filterFields(data, allowed)

		try {

			var result = yield db.query([ "INSERT INTO", TABLE, "VALUES ?", insertion, "RETURNING *" ])
			return result.pop()

		} catch(e) {

			var err = new Error()

			if (e.constraint) {

				if (/email/i.test(e.constraint)) {
					err.message = config.msg.email_already_registered
					err.status = 403
					throw err
				}

				if (/username/i.test(e.constraint)) {
					err.message = config.msg.username_taken
					err.status = 403
					throw err
				}

			}

			logger.error(e)

			err.message = config.msg.user_unknown_error
			err.status = 500

			throw err
		}
	}

	model.getList = function* (pagination) {

		return yield db.query([
			"SELECT", selection.concat("email"),
			"FROM", TABLE,
			"LIMIT ? OFFSET ?", pagination.limit, pagination.offset
		])

	}

	model.getPublicList = function* (pagination) {

		return yield db.query([
			"SELECT", selection,
			"FROM", TABLE,
			"LIMIT ? OFFSET ?", pagination.limit, pagination.offset
		])

	}

	return model
}

// @autoinject
module.exports.user = userModelFactory

