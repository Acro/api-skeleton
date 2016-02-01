const koa = require("koa")
const koalogger = require("koa-logger")
const compress = require("koa-compress")
const route = require("koa-route")
const koabody = require("koa-body")

var app = koa()

var apiFactory = function (auth, error_helper, pagination, config, logger, user_route) {

	// private methods
	var setupMiddlewares = function () {

		app.use(compress())
		app.use(error_helper.catchErrors)

		if (process.env.NODE_ENV != "test") {
			app.use(koalogger())
		}

		app.use(koabody(config.koa.body))
		app.use(error_helper.debugMode)
		app.use(auth.authenticate)
		app.use(pagination.extract)
		
	}

	var setupRoutes = function () {

		app.use(route.post("/users", user_route.create))
		app.use(route.get("/users", user_route.getList))
		app.use(route.get("/users/public", user_route.getPublicList))
		app.use(route.get("/users/:user_id", user_route.getOne))

	}

	// setup everything upon object creation
	setupMiddlewares()
	setupRoutes()

	// expose public methods
	var api = {}

	api.start = function* () {

		var port = process.env.PORT || config.koa.port
		logger.info(config.koa.name, "listening @", port, " [", process.env.NODE_ENV || "development", "]")
		return app.listen(port)

	}

	api.app = app

	return api
}

// @autoinject
module.exports.api = apiFactory
