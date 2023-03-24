const axios = require('axios')

module.exports = async (req, res) => {
    const id = req.params.id 

    const query = `
    query submission($id: ID!) {
        submission(id: $id) {
            id,
            quiz {
                title
            },
            score
        }
    }
    `
    try {
        const data = await axios.post('http://localhost:3000/graphql', {
            query,
            variables: {
                id
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const submission = data.data.data.submission


        res.render('quiz-results', { user: req.verifiedUser, submission })
    } catch(err) {
        console.log(err)
        res.redirect('/')
    }
}
