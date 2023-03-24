const axios = require('axios')

module.exports = async (req, res) => {
    const submissionData = {
        quizId: req.body.quizId,
        userId: req.verifiedUser.id,
        answers: []
    }

    for(const key in req.body) {
        if (key !== 'title' && key !== 'quizId') {
            submissionData.answers.push({
                questionId: key,
                answer: req.body[key]
            })
        }
    }

    try {
        const mutation = `
            mutation submitQuiz($userId: String!, $quizId: String!, $answers: [AnswerInputType!]!) {
                submitQuiz(userId: $userId, quizId: $quizId, answers: $answers)
            }
        `

        const data = await axios.post('http://localhost:3000/graphql', {
            query: mutation,
            variables: submissionData
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const submissionId = data.data.data.submitQuiz
        res.redirect(`/quiz/results/${submissionId}`)
    } catch(err) {
        res.send(err)
    }
}