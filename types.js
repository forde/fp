/*
|--------------------------------------------------------------------------
|  MONADS & FUNCTORS
|--------------------------------------------------------------------------
*/

const Right = x => ({
    map: f => Right(f(x)),
    chain: f => f(x),
    fold: (f, g) => g(x),
    inspect: () => console.log(`Right(${x})`),
})

const Left = x => ({
    map: f => Left(x),
    chain: f => Left(x),
    fold: (f, g) => f(x),
    inspect: () => console.log(`Left(${x})`),
})

// Either = Right || Left
const Either = {
    of: x => Right(x)
}

const fromNullable = x => x != null ? Right(x) : Left(null)

const fromBool = x => x ? Right(x) : Left(null)

// tryCatch :: f -> Right(f()) Left(e)
const tryCatch = f => {
    try {
        return Right(f())
    } catch(e) {
        return Left(e)
    }
}

/*
|--------------------------------------------------------------------------
|  COMBINATORS
|--------------------------------------------------------------------------
*/

/*
    Tap
    A combinator is very useful for functions that return nothing.
    It takes the function to which the parameter goes and then it is returned.
*/
const tap = fn => value => {
    fn(value)
    return value
}

/*
    Fork
    The fork combiner is useful in situations where you want to process a value in two ways
    and combine the result.
*/
const fork = (join, fn1, fn2) => (value) => join(fn1(value), fn2(value))

/*
    Alteration (getting rid of IF statements)
    This combinator takes two functions and returns the result of the first if true.
    Otherwise, it returns the result of the second function.
*/
const alt = (fn, orFn) => (value) => fn(value) || orFn(value)

/*
    Sequence
    It accepts many independent functions and passes the same parameter to each of them.
    Typically, these functions do not return any value.
*/
const seq = (...fns) => (val) => fns.forEach(fn => fn(val))

/*
|--------------------------------------------------------------------------
|  SEMIGROUPS
|--------------------------------------------------------------------------
*/

// semigroup for concating numbers
const Sum = x => ({
    x,
    concat: ({x:y}) => Sum(x + y),
    inspect: () => `Sum(${x})`
})
// define neutral element for Sum type (so Sum can become monoid)
Sum.empty = () => Sum(0) // 0 is the neutral element because any sum of x + 0 === x

// semigroup for concating bools
const All = x => ({
    x,
    concat: ({x:y}) => All(x && y),
    inspect: () => `All(${x})`
})
// define neutral element for All type (so All can become monoid)
All.empty = () => All(true) // true is the neoutal element

// semigroup for concating bools
const Any = x => ({
    x,
    concat: ({x:y}) => Any(x || y),
    inspect: () => `Any(${x})`
})
// define neutral element for Any type (so Any can become monoid)
Any.empty = () => Any(false) // false is the neoutal element

// special semigroup that will always keep the first value no matter what we concat to it
const First = x => ({
    x,
    concat: _ => First(x),
    inspect: () => `First(${x})`
})
// First can't be promoted to monoid because we can't define neutral elemenet

module.exports = {
    Right,
    Left,
    Either,
    fromNullable,
    fromBool,
    tryCatch,
    First,
    Any,
    All,
    Sum,
    seq,
    alt,
    fork,
    tap
}