var config = {
	auth: {
		expires_in_seconds: 31557600, // one year
		hash_salt: process.env.HASH_SALT
	},
	firebase: { },
	koa: {
		name: "Your API",
		port: 1337,
		body: {
			multipart: true
		},
		public_routes_post: [ 
			"/users",
			"/login"
		],
		public_routes_get: [ 
			"/users/public"
		]
	},
	pg: {
		url: process.env.PG_URL || process.env.DATABASE_URL,
		ssl: process.env.PG_SSL !== "false",
		pool_size: process.env.PG_POOL_SIZE || 8
	},
	pagination: {
		max_per_page: 20
	},
	msg: {
		auth_error: "Please log in and try again.",
		username_taken: "User with that username already exists.",
		user_unknown_error: "Unable to create new user.",
		invalid_credentials: "Incorrect username or password",
		user_missing_params: "Provide all required information: email, username and password.",
		email_already_registered: "This email is already registered"
	}
}

// @autoexport
module.exports.config = config
