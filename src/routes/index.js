module.exports = (app) => {
    app.use('/', require('./dashboard'))
    app.use('/auth', require('./auth'))
    app.use('/quiz', require('./quiz'))
}