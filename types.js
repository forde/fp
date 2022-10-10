import Task from 'data.task'
import fetch from 'node-fetch'

export const Right = x => ({
    map: f => Right(f(x)),
    chain: f => f(x),
    fold: (f, g) => g(x),
    inspect: () => console.log(`Right(${x})`),
})

export const Left = x => ({
    map: f => Left(x),
    chain: f => Left(x),
    fork: (f, g) => Left(x),
    fold: (f, g) => f(x),
    inspect: () => console.log(`Left(${x})`),
})

export const fromNullable = x => x != null ? Right(x) : Left(null)

export const fromBool = x => x ? Right(x) : Left(null)

const postUrl = 'https://634432ffdcae733e8fd9f73d.mockapi.io/users/1'

const apiCall = url => {
    return new Task(async (reject, resolve) => {
        fetch(url)
            .then(resp => resp.json())
            .then(data => resolve(data))
            .catch(e => reject(e))
    })
}

const log = str => () => console.log(str)

const e = e => console.log('Error:', e)

const s = s => console.log('Success:', s)

const tap = fn => value => {
    fn(value)
    return value
}

fromBool(false)
    .map(tap(log('Loading ON')))
    .chain(() => apiCall(postUrl))
    .map(tap(log('Loading OFF')))
    .fork(e, s)

//apiCall(postUrl).fork(e, s)