const { User, Question, Quiz, Submission } = require('../models')
const { GraphQLString, GraphQLList } = require('graphql')
const { createJWT } = require('../util/auth')
const { QuestionInputType, AnswerInputType } = require('./types')


const register = {
    type: GraphQLString,
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        // Check if a user exists with inputted email
        const checkUser = await User.findOne({ email: args.email })

        console.log(checkUser)

        if (checkUser) {
            throw new Error('User with this email address already exists')
        }

        const newUser = new User({
            username: args.username,
            email: args.email,
            password: args.password
        })

        await newUser.save()

        return createJWT(newUser)
    }
}  

const login = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        const user = await User.findOne({ email: args.email })

        if (!user || user.password !== args.password) {
            throw new Error('Invalid Credentials')
        }

        return createJWT(user)
    }
}

const createQuiz = {
  type: GraphQLString,
  args: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      userId: { type: GraphQLString },
      questions: { type: new GraphQLList(QuestionInputType) }
  },
  async resolve(parent, args) {
      console.log(args)
      const slugify = args.title.toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/[ ]/g, '-')

      let fullSlug = ''

      while(true) {
          let slugId = Math.floor(Math.random() * 1000000)

          fullSlug = `${slugify}-${slugId}`

          const existingQuiz = await Quiz.findOne({ slug: fullSlug })

          if (!existingQuiz) {
              break
          }
      }

      const quiz = new Quiz({
          slug: fullSlug,
          title: args.title,
          description: args.description,
          userId: args.userId
      })

      await quiz.save()

      for (const question of args.questions) {
          const questionObj = new Question({
              title: question.title,
              correctAnswer: question.correctAnswer,
              order: question.order,
              quizId: quiz.id
          })
          questionObj.save()
      }

      return fullSlug
  }
}

const submitQuiz = {
  type: GraphQLString,
  args: {
      userId: { type: GraphQLString },
      quizId: { type: GraphQLString },
      answers: { type: new GraphQLList(AnswerInputType) }
  },
  async resolve(parent, args) {
      let correct = 0

      for (const answer of args.answers) {
          const question = await Question.findById(answer.questionId)

          if (question.correctAnswer.toLowerCase().trim() === answer.answer.toLowerCase().trim()) {
              correct++
          }
      }

      const submission = new Submission({
          userId: args.userId,
          quizId: args.quizId,
          score: (correct / args.answers.length) * 100
      })

      await submission.save()
      return submission.id
  }
}

module.exports = {
    register,
    login,
    createQuiz,
    submitQuiz,
} 