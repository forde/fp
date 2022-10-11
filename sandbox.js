import Task from 'data.task'
import fetch from 'node-fetch'

import { fromBool, tap } from './types'

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

fromBool(false)
    .map(tap(log('Loading ON')))
    .chain(() => apiCall(postUrl))
    .map(tap(log('Loading OFF')))
    .fork(e, s)

//apiCall(postUrl).fork(e, s)