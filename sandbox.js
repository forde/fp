const { task, of, rejected } = require('folktale/concurrency/task')
const fetch = require('node-fetch')
const { pipe, pipeWith } = require('ramda')

const { fromBool, tap, Right, Left } = require('./types')

const postUrl = 'https://634432ffdcae733e8fd9f73d.mockapi.io/users/1'

const get = async () => {
    const resp = await fetch(postUrl)
    const data = await resp.json()
    //console.log(data)
    return data
}

//const pipeWithPromise = pipeWith((fun, previousResult) => (previousResult && previousResult.then) ? previousResult.then(fun) : fun(previousResult));
const pipeWithPromise = (...args) =>
    pipeWith((f, val) => {
    if(val && val.then) {
        return val.then(f)
    }
    if(Array.isArray(val) && val.length && val[0] && val[0].then) {
        return Promise.all(val).then(f)
    }
    return f(val)
})(args)

const log = text => val => {
    console.log(text, val)
    return val
}

Right.map = async f => {
    //await Right(f(x))
    return await [f].reduce(
        (acc, fn) => acc.then(fn),
        Promise.resolve(null)
    )
}

const right = x => ({
    map: f => {
        console.log(x)
        const res = f(x)
        if(res.then) {
            return { ...res.then(f), ...Left(res) }
        } else {
            return right(res)
        }
    },
    chain: f => f(x),
    fold: (f, g) => g(x),
    inspect: () => console.log(`Right(${x})`),
})

right(true)
    .map(log('A'))
    .map(log('B'))
    .map(get)
    .map(log('C'))
    .map(log('D'))
    .map(log('E'))
