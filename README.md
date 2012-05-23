# suitestack

simplified unit testing

## Example

    var test = require("suitestack"),
        assert = require("assert"),
        noOfTests = 0

    test("A synchronous unit test", function () {
        assert.equal(true, true, "JavaScript hates us :(")
    })

    test("A nested test", function (test) {
        test("an inner test", function () {
            assert(true, "Does not work inside")
        })

        test("An asynchronous test", function (test, done) {
            setTimeout(function () {
                assert(true, "asynchronous tests do not work")
                done()
            })
        })
    })

    test.on("error", function (err) {
        console.error("test failed ", err.message)
    })

    test.on("test end", function () {
        noOfTests++
    })

    test.on("end", function () {
        console.log(noOfTests, " tests passed")
    })