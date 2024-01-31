module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);  // catch any errors and pass them to next
    }
}

// This function accepts a function and returns a new function that wraps the original function in a try/catch block. The new function catches any errors and passes them along to next(). This allows us to write async code without worrying about try/catch blocks in our route handlers. We can now refactor our routes to use this function. So put simply, this function is a wrapper for our route handlers.