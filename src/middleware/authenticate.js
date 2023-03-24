const jwt = require('jsonwebtoken')

const unprotectedRoutes = [
    '/auth/login',
    '/auth/register',
    '/graphql'
]

const authenticate = async (req, res, next) => {
    try{
        const token = req.cookies.JWT
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET)

        console.log('User verified', verifiedUser)
        req.verifiedUser = verifiedUser
        next()

    } catch(e) {
        // User verification failed
        console.log('User verification failed')

        if (unprotectedRoutes.includes(req.path)) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}

module.exports = {
    authenticate,
}