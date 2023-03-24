module.exports = (req, res) => {
    res.cookie('JWT', '', {
        httpOnly: true
    })
    res.redirect('/auth/login')
}