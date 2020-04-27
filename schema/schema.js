'use strict';

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull} = require(
    'graphql');

const review = require('../models/review');
const topList = require('../models/topList');

const reviewType = new GraphQLObjectType({
   name: 'review',
   description: 'A single review of a movie',
   fields: () => ({
       id: {type: GraphQLID},
       movieTitle: {type: GraphQLString},
       moviePoster: {type: GraphQLString},
       comment: {type: GraphQLString}
   })
});

const topListType = new GraphQLObjectType({
   name: 'topList',
   description: 'A list containing 10 reviews',
   fields: () => ({
       id: {type: GraphQLID},
       listName: {type: GraphQLString},
       review: {
           type: reviewType,
           resolve: async (parent, args) => {
               try {
                   return await review.findById(parent.review);
               } catch (e) {
                   return new Error(e.message);
               }
           }
       }
   })
});

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       topLists: {
           type: new GraphQLList(topListType),
           description: 'Get all top lists',
           resolve: async (parent, args) => {
               try {
                   return await topList.find();
               } catch (e) {
                   return new Error(e.message);
               }
           }
       },
       topList: {
           type: new GraphQLList(topListType),
           description: 'Get a specific list',
           args: {
               listName: {type: GraphQLString}
           },
           resolve: async (parent, args) => {
               try {
                   return await topList.find(args.listName);
               } catch (e) {
                   return new Error(e.message);
               }
           }
       },
       topListTag: {
           type: new GraphQLList(topListType),
           
       }
   }
});

module.exports = new GraphQLSchema({
   query: RootQuery 
});