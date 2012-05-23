var test = require("suitestack"),
    assert = require("assert"),
    total = 0

// report
test.on("error", function (err, name) {
    console.error("FAIL:", err.message, err.stack, name)
})

test.on("test", function () {
    total++
})

test.on("test end", function () {
    total--
})

test.on("pass", function (name) {
    console.log("PASS:", name)
})

test.on("end", function () {
    assert(total === 0, "tests did not finish")
    console.log("test finished")
})

// tests
test("test is a function", function () {
    assert(typeof test === "function", "test is not a function")
})

test("test is an eventemitter", function () {
    assert(test.on, "test is not an eventemitter")
})

test("test fires an error event when test block fails", function (_, done) {
    var t = test.makeTest()

    t.on("error", function (err, name, test) {
        assert(err.message === "fail", "test did not fail")
        assertName(name)
        assertTest(test)
        done()
    })

    t("name", function () {
        assert(false, "fail")
    })
})

test("test works asynchronously", function (_, done) {
    var t = test.makeTest()

    t.on("pass", function (name) {
        assertName(name)
        done()
    })

    t("name", function (_, done) {
        setTimeout(function () {
            done()
        }, 50)
    })
})

test("test fires a test event when you start a test", function (_, done) {
    var t = test.makeTest()

    t.on("test", function (name, test) {
        assertName(name)
        assertTest(test)
        done()
    })

    t("name", function () {})
})

test("test fires a test end event when a test ends", function (_, done) {
    var t = test.makeTest(),
        count = 0

    t.on("test end", function (name, test) {
        assertName(name)
        assertTest(test)
        assert(count === 1, "count is incorrect")
        done()
    })

    t("name", function () {
        count++
    })
})

test("tests fires pass when a tests passes", function (_, done) {
    var t = test.makeTest(),
        count = 0

    t.on("pass", function (name, test) {
        assertName(name)
        assertTest(test)
        assert(count === 1, "count is incorrect")
        done()
    })

    t("name", function () {
        count++
    })
})

test("asynchronous exceptions are caught", function (_, done) {
    var t = test.makeTest()

    t.on("error", function (err, name) {
        assertName(name)
        assert(err.message === "fail", "error did not fail")
        done()
    })

    t("name", function (_, done) {
        setTimeout(function () {
            assert(false, "fail")
        }, 50)
    })
})

test("tests run in test order", function (_, done) {
    var t = test.makeTest(),
        count = 0

    t.on("end", function () {
        assert(count === 7, "not all tests finished")
        done()
    })

    t("first", function (t) {
        assert(++count === 1, "count is out of order")
        t("second", function () {
            assert(++count === 2, "count is out of order")
        })

        t("third", function () {
            assert(++count === 3, "count is out of order")
        })
    })

    t("fourth", function (t) {
        assert(++count === 4, "count is out of order")
        t("fifth", function (t) {
            assert(++count === 5, "count is out of order")
            t("sixth", function () {
                assert(++count === 6, "count is out of order")
            })
        })

        t("seventh", function () {
            assert(++count === 7, "count is out of order")
        })
    })
})

function assertName(name) {
    assert(name === "name", "test name is incorrect")
}

function assertTest(test) {
    assert(test, "test object does not exist")
}