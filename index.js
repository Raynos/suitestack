var extend = require("xtend"),
    EventEmitter = require("events").EventEmitter.prototype,
    test = makeTest(),
    currentEmitter

test.makeTest = makeTest

process.on("uncaughtException", reportError)

module.exports = test

function makeTest(parent) {
    extend(test, {
        nodes: [],
        parent: parent
    })

    if (parent === undefined) {
        extend(test, EventEmitter)
    }

    return test

    function test(name, block) {
        if (parent === undefined && test.nodes.length === 0) {
            process.nextTick(run.bind(null, test))
        }

        test.nodes.push(extend(makeTest(test), {
            testName: name,
            block: block
        }))
    }    
}

function run(test) {
    var node = findNode(test)
    if (node) {
        currentEmitter = test
        currentEmitter.errorName = node.testName
        runTest({
            emitter: test, 
            test: node, 
            name: node.testName, 
            block: node.block, 
            callback: next
        })
    } else {
        test.emit("end")
        test.nodes = []
    }

    function next() {
        node.block = null
        run(test)
    }
}

function findNode(tree) {
    var nodes = tree.nodes
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i]
        if (node.block) {
            return node
        }
        node = findNode(node)
        if (node !== undefined && node.block) {
            return node
        }
    }
}

function runTest(options) {
    var emitter = options.emitter,
        block = options.block,
        test = options.test,
        name = options.name

    emitter.emit("test", name, test)

    try {
        if (block.length === 2) {
            block(test, done)
        } else {
            block(test)
            done()
        }
    } catch (err) {
        done(err)
    }

    function done(err) {
        if (err) {
            emitter.emit("error", err, name, test)
        } else {
            emitter.emit("pass", name, test)
        }
        emitter.emit("test end", name, test)
        options.callback()
    }
}

function reportError(err) {
    if (currentEmitter && currentEmitter._events.error) {
        currentEmitter.emit("error", err, currentEmitter.errorName)
    } else {
        console.log("ERROR in test", err.message, err.stack, err)
    }
}