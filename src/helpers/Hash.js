const crypto = require("crypto")

var hashHelperFactory = function (config) {
	// expose public methods
	var helper = {}

	helper.get = function (string) {
		return crypto.createHash("sha256").update( string + config.auth.hash_salt ).digest("hex")
	}

	return helper
}

// @autoinject
module.exports.hash = hashHelperFactory