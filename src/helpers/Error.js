var _ = require("lodash")

var errorHelperFactory = function (logger) {
	// expose public methods
	var helper = {}

	helper.catchErrors = function* (next) {

		try {

			yield next

		} catch (err) {
			var body = {}

			body.status = err.status || 500
			body.title = err.title
			body.message = err.message || this.message

			if (err.name == "ValidatorException") {
				body.validation_messages = err.validation_messages
			}

			this.type = "json"
			this.body = body
			this.status = body.status

			if (this.status >= 400 && err) {
				var log = _.clone(body, true)

				if (err.stack) {
					var match = err.stack.match(/.*\/src\/.*/g)
					if (match) {
						log.context = match.join("")
					}
				}

				logger.error(log)
			}
		}
	}

	helper.debugMode = function* (next) {

		var debug = /debug/.test(this.request.querystring)
		if (debug) {

			console.log("path", this.request.path)
			console.log("query", this.request.querystring)
			console.log("body", JSON.stringify(this.request.body))
			console.log("headers", JSON.stringify(this.request.headers))

			if (this.request.body) {
				console.log("multipart fields", JSON.stringify(this.request.body.fields))
				console.log("multipart files keys", this.request.body.files ? _.keys(this.request.body.files) : null)
				console.log("multipart files", JSON.stringify(this.request.body.files))
			}
			
		}

		yield next

		if (debug) {
			console.log("status", this.status)
			console.log("response", JSON.stringify(this.body))
		}

	}

	return helper
}

// @autoinject
module.exports.error_helper = errorHelperFactory
