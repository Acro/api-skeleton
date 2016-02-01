"use strict"

module.exports = function(test, request, helper) {

	test("== " + __filename + " ==", function* () {})

	test("Create a user", function* (t) {

		var user = {
			username: "User " + Math.random(),
			password: Math.random() + "",
			email: "random@user.com"
		}

		var api_request = request
			.post("/users")
			.send(user)
			.expect(201)

		var resp = yield api_request.end()

		t.ok(resp, "server returns 201")
	})

	test("Create a user with the existing email", function* (t) {

		var user = {
			username: "User " + Math.random(),
			password: Math.random() + "",
			email: "random@user.com"
		}

		var api_request = request
			.post("/users")
			.send(user)
			.expect(403)

		var resp = yield api_request.end()

		t.ok(resp, "server returns 403")
	})

	test("Fail to get list using unauthorized request", function* (t) {

		var api_request = request
			.get("/users")
			.expect(401)

		var resp = yield api_request.end()

		t.ok(resp, "server returns 401")

	})

	test("Get list of users", function* (t) {

		// create new user
		var user = {
			username: "User " + Math.random(),
			password: Math.random() + "",
			email: "random@user2.com"
		}

		var api_request = request
			.post("/users")
			.send(user)
			.expect(201)


		var resp = yield api_request.end()

		t.ok(resp, "server returns 201")

		var session_token = resp.body.session_token

		var api_request = request
			.get("/users")
			.set("Authorization", "Bearer " + session_token)
			.expect(200)

		var resp = yield api_request.end()

		t.ok(resp, "server returns 200")

		console.log(resp.body)

		t.ok(resp.body.data.length > 1, "server returns more than one user")
		t.ok(resp.body.data[0].email != undefined, "server does return email addresses")

	})

	test("Get public list of users", function* (t) {

		var api_request = request
			.get("/users/public")
			.expect(200)

		var resp = yield api_request.end()

		t.ok(resp, "server returns 200")

		console.log(resp.body)

		t.ok(resp.body.data.length > 1, "server returns more than one user")
		t.ok(resp.body.data[0].email == undefined, "server does not return email addresses")

	})

}

