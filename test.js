require("dotenv").load({path: ".env-test", silent: true})

var co = require("co")
var supertest = require("co-supertest")
var ZenInjector = require("zeninjector")
var testRunner = require("bandage/runner")
var testHelper = require("./test/helper")

co(function* runTests() {

	var container = new ZenInjector({
		mock_modules: {}
	})

	container.registerAndExport("logger", console)

	yield container.scan(__dirname + "/src/**/*.js")

	var api = yield container.resolve("api")

	api.app.on("error", function(err) {
		console.log(err)
	})

	var request = supertest(api.app.callback())
	var helper = testHelper(request, container)

	var file = process.argv[2]
	if (file) {
		console.log("Test file: ", file)
	}

	var db = yield container.resolve("db")

	testRunner ( [ request, helper, container ], file, db.disconnect)

}).catch(function(err) {
	console.log(err.stack)
	console.log(err)
	process.exit(1)
})

