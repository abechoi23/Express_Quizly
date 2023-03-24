const axios = require('axios')

module.exports = async (req, res) => {
    const quizData = {
        title: req.body.quizTitle,
        description: req.body.quizDescription,
        userId: req.verifiedUser.id,
        questions: []
    }

    /* const endGoal = [
        {
            title: 'q1',
            correctAnswer: 'a1',
            order: 1
        },
        {
            title: 'What is 10+25?',
            correctAnswer: '35',
            order: 2
        }
    ] */

    for (const key in req.body) {
        if (key.includes('questionTitle')) {
            const questionNum = parseInt(key.split('questionTitle')[1])

            while(!quizData.questions[questionNum]) {
                quizData.questions.push({})
            }

            quizData.questions[questionNum].title = req.body[key]
        } else if (key.includes('questionAnswer')) {
            const questionNum = parseInt(key.split('questionAnswer')[1])

            while(!quizData.questions[questionNum]) {
                quizData.questions.push({})
            }

            quizData.questions[questionNum].correctAnswer = req.body[key]
            quizData.questions[questionNum].order = questionNum
        }
    }

    try {
        const mutation = `
            mutation createQuiz($userId: String!, $title: String!, $description: String!, $questions: [QuestionInputType!]!) {
                createQuiz(userId: $userId, title: $title, description: $description, questions: $questions)
            }
        `

        const data = await axios.post('http://localhost:3000/graphql', {
            query: mutation,
            variables: quizData
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const slug = data.data.data.createQuiz
        res.redirect(`/quiz/success/${slug}`)
    } catch(err) {
        res.send(err)
    }
}