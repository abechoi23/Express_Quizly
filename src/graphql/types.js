const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType
} = require("graphql");
const { User, Quiz, Submission, Question } = require("../models");

const UserType = new GraphQLObjectType({
  name: "User",
  description: "User type",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    quizzes: {
      type: new GraphQLList(QuizType),
      resolve(parent, args) {
        return Quiz.find({
          userId: parent.id,
        });
      },
    },
    submissions: {
      type: new GraphQLList(SubmissionType),
      resolve(parent, args) {
        return Submission.find({ userId: parent.id });
      },
    },
  }),
});

const QuizType = new GraphQLObjectType({
  name: "Quiz",
  description: "Quiz Type",
  fields: () => ({
    id: { type: GraphQLID },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    userId: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    questions: {
      type: new GraphQLList(QuestionType),
      resolve(parent, args) {
        return Question.find({ quizId: parent.id });
      },
    },
    submissions: {
      type: new GraphQLList(SubmissionType),
      resolve(parent, args) {
        return Submission.find({ quizId: parent.id });
      },
    },
    avgScore: {
      type: GraphQLFloat,
      async resolve(parent, args) {
        const submissions = await Submission.find({
          quizId: parent.id,
        });
        let totalScore = 0;

        for (const submission of submissions) {
          totalScore += submission.score;
        }
        return totalScore / submissions.length;
      },
    },
  }),
});

const QuestionType = new GraphQLObjectType({
  name: "Question",
  description: "Question Type",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    correctAnswer: { type: GraphQLString },
    order: { type: GraphQLInt },
    quizId: { type: GraphQLString },
  }),
});

const QuestionInputType = new GraphQLInputObjectType({
  name: 'QuestionInputType',
  description: 'Input object for questions when creating a quiz',
  fields: () => ({
      title: { type: GraphQLString },
      correctAnswer: { type: GraphQLString },
      order: { type: GraphQLInt }        
  })
})

const AnswerInputType = new GraphQLInputObjectType({
  name: 'AnswerInputType',
  description: 'Input object for answers when submitting a quiz',
  fields: () => ({
      questionId: { type: GraphQLString },
      answer: { type: GraphQLString }
  })
})


const SubmissionType = new GraphQLObjectType({
  name: "Submission",
  description: "Submission Type",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLString },
    quizId: { type: GraphQLString },
    score: { type: GraphQLFloat },
    quiz: {
      type: QuizType,
      resolve(parent, args) {
        return Quiz.findById(parent.quizId);
      },
    },
  }),
});

module.exports = {
  UserType,
  QuizType,
  QuestionType,
  SubmissionType,
  QuestionInputType,
  AnswerInputType
};
