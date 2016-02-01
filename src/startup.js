require("dotenv").load({ silent: true })

var co = require("co")
var ZenInjector = require("zeninjector")
var container = new ZenInjector()
var fs = require("fs")

var _ = require("lodash")

container.registerAndExport("logger", console)

var prepareGraph = function(modules) {

	var dep_string = _.reduce(_.sortBy(modules, "name"), function (str, module) {
		var dependencies = _.filter(module.dependencies, function (dep) { return dep != "logger" && dep != "config" })
		return str + module.name + " -> { " + dependencies.join(" ") + " } "
	}, "digraph YourDI { ") + " }"

	fs.writeFile("di_graph.dot", dep_string)
}

var boot = function* () {

	yield container.scan(__dirname + "/**/*.js")

	if (process.env.NODE_ENV !== "production") {
		prepareGraph(container._modules)
	}

	var api = yield container.resolve("api")

	yield [ api.start ]
}

var handleError = (err) => {
	console.log(err.stack)
	throw err
}

co(boot).catch(handleError)
