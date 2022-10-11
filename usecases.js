/*
    Combinators are higher-level function that allows you to combine functions,
    variables, or other combinators. Usually, they do not contain declarations
    of their own variables or business logic. They are the only ones to flush
    the control in a function program.

    Combinator examples: Tap, Currying, Pipe/Compose, Fork, Alternation, Sequence
*/

/*
    Tap
*/
const [items, setItems] = useState([])

axios
    .get('http://localhost')
    .then(({ data }) => data)
    .then(tap(setItems)) // (data) => { setItems(data); return data }
    .then(tap(console.log)) // one then = one function = one responsibility
    .then(tap(onLoadData)) // still access to original data
    //.then(...) // easy on maintain open/close principle


/*
    Fork
*/
const length = (array) => array.length
const sum = (array) => array.reduce((a, b) => a + b, 0)
const divide = (a, b) => a / b

const arithmeticAverage = fork(divide, sum, length)

arithmeticAverage([5, 3, 2, 8, 4, 2]) // returns 4

/*
    Alteration (getting rid of IF statements)
*/
const users = [{
    uuid: '123e4567-e89b-12d3-a456-426655440000',
    name: 'William'
}]

const findUser = ({ uuid: searchesUuid }) => users.find(({ uuid }) => uuid === searchesUuid)
const newUser = data => ({ ...data, uuid: uuid() })

const findOrCreate = alt(findUser, newUser)

findOrCreate({ uuid: '123e4567-e89b-12d3-a456-426655440000' }) // returns William object
findOrCreate({ name: 'John' }) // returns John object with new uuid

/*
    Sequence
*/
const appendUser = (id) => ({ name }) => document.getElementById(id).innerHTML = name

const onContactUpdate = () => alert('contact updated')

const printUserContact = pipe(
    findOrCreate, // returns user
    seq(
        appendUser('#contact'), // user => void
        console.log,            // user => void
        onContactUpdate         // user => void
    )
)

printUserContact({ name: 'Konrad' })