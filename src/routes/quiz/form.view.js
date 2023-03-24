const axios = require('axios')

module.exports = async (req, res) => {
    const slug = req.params.slug 

    const query = `
    query quizBySlug($slug: String!) {
        quizBySlug(slug: $slug) {
            id,
            slug,
            title,
            description,
            questions {
                id,
                title,
                order,
                correctAnswer
            }
        }
    }
    `
    try {
        const data = await axios.post('http://localhost:3000/graphql', {
            query,
            variables: {
                slug
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const quizData = data.data.data.quizBySlug

        quizData.questions = quizData.questions.sort((a,b) => a.order - b.order)

        res.render('quiz', { user: req.verifiedUser, quiz: quizData })
    } catch(err) {
        console.log(err)
        res.redirect('/')
    }
}
