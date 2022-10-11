const { task, of, rejected } = require('folktale/concurrency/task')
const fetch = require('node-fetch')

//const { fromBool, tap, Right, Left } = require('./types')

const postUrl = 'https://634432ffdcae733e8fd9f73d.mockapi.io/users/1'

const get = async (url) => {
    const resp = await fetch(url)
    const data = await resp.json()
    return data
}

const log = text => val => {
    console.log(text, val)
    return val
}

const promiseFromBool = bool => new Promise((res, rej) => bool ? res(bool) : rej(bool))

const promise = val => new Promise((res, rej) => res(val))

promiseFromBool(false)
    .then(log('A'))
    .then(log('B'))
    .then(() => get(postUrl))
    .then(log('C'))
    .then(log('D'))
    .catch(log('Error'))
    .finally(log('Done'))
      