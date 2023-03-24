const queries = require('./queries')
const mutations = require('./mutations')
const { GraphQLSchema, GraphQLObjectType } = require('graphql')

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'All of our queries',
    fields: queries
})

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'All of our mutations',
    fields: mutations
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})