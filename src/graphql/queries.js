const { User, Quiz, Submission } = require('../models')
const { UserType, SubmissionType, QuizType } = require('./types')
const { GraphQLList, GraphQLID, GraphQLString } = require('graphql')

const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users from the database',
    resolve(parent, args) {
        return User.find()
    }
}

const user = {
    type: UserType,
    description: "Query a user by their ID",
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent,args) {
        return User.findById(args.id)
    }
}

const quizBySlug = {
    type: QuizType,
    description: "query a quiz by its slug",
    args: {
        slug: { type: GraphQLString }
    },
    resolve(parent,args) {
        return Quiz.findOne({ slug: args.slug })
    }
}

const submission = {
    type: SubmissionType,
    description: "Query a submission by its ID",
    args: {
        id: { type: GraphQLID}
    },
    resolve(parent, args) {
        return Submission.findById(args.id)
    }
}

module.exports = {
    users,
    user,
    quizBySlug,
    submission
}