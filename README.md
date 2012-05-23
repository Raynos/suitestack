# suitestack

simplified unit testing

## Example

    var test = require("suitestack"),
        assert = require("assert"),
        noOfTests = 0

    // report
    test.on("error", function (err) {
        console.error("FAIL:", err.message)
    })

    test.on("pass", function (name) {
        console.log("PASS:", name)
    })

    test.on("test", function () {
        noOfTests++
    })

    test.on("test end", function () {
        noOfTests--
    })

    test.on("end", function () {
        assert(noOfTests === 0, "all tests did not finish")
    })

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
            }, 50)
        })
    })