"use strict"

var userRouteFactory = function (config, user, auth, session, logger, response) {

	var route = {}

	route.create = function* () {

		if (!this.request.body) {
			this.throw(422, "Request body doesn't contain any fields")
		}

		if (!this.request.body.email || !this.request.body.password) {
			this.throw(403, config.msg.user_missing_params)
		}

		var new_user = yield user.create(this.request.body)

		var session_info = yield auth.generateNewSession(new_user.id)
		yield session.create(new_user.id, session_info.db_token, session_info.expires_at)

		this.body = {
			user_id: new_user.id,
			session_token: session_info.session_token
		}

		this.status = 201
	}

	route.getOne = function* (id) {
		var loaded_user = yield user.get(id)
		this.body = loaded_user
	}

	route.getList = function* () {
		var loaded_users = yield user.getList(this.state.pagination)
		this.state.pagination.force_offset = true
		this.body = response.format(loaded_users, this.request.path, this.request.query, this.state.pagination)
	}

	route.getPublicList = function* () {
		var loaded_users = yield user.getPublicList(this.state.pagination)
		this.state.pagination.force_offset = true
		this.body = response.format(loaded_users, this.request.path, this.request.query, this.state.pagination)
	}

	return route
}

// @autoinject
module.exports.user_route = userRouteFactory
