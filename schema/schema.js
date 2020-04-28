'use strict';

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull} = require(
    'graphql');

const review = require('../models/review');
const topList = require('../models/topList');
const user = require('../models/userModel');

const reviewType = new GraphQLObjectType({
   name: 'review',
   description: 'A single review of a movie',
   fields: () => ({
       id: {type: GraphQLID},
       MovieTitle: {type: GraphQLString},
       MoviePoster: {type: GraphQLString},
       Comment: {type: GraphQLString}
   })
});

const topListType = new GraphQLObjectType({
   name: 'topList',
   description: 'A list containing 10 reviews',
   fields: () => ({
       id: {type: GraphQLID},
       ListName: {type: GraphQLString},
       Review: {
           type: reviewType,
           resolve: async (parent, args) => {
               try {
                   return await review.findById(parent.review);
               } catch (e) {
                   return new Error(e.message);
               }
           }
       },
       Comment: {type: GraphQLString},
       Author: {type: GraphQLString}
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

const Mutation = new GraphQLObjectType({
   name: 'MutationType',
   description: 'Mutations',
   fields: {
       addTopList: {
           type: topListType,
           description: 'Add new topList',
           args: {
               Review: {
                   type: new GraphQLNonNull(
                       new GraphQLList(reviewType)
                   )
               },
               Comment: {type: GraphQLString},
               Author: {type: new GraphQLNonNull(GraphQLString)}
           },
           resolve: async (parent, args, {req, res, checkAuth}) => {
               try {
                   checkAuth(req, res);
                   let reviews = [];
                   await args.Review.map(rev => {
                       const newReview = new review(rev);
                       newReview.save();
                       reviews.push(newReview);
                   });
                   args.Review = reviews;
                   const newTopList = new topList(args);
                   return await newTopList.save();
               } catch (e) {
                   return new Error(e.message);
               }
           }
       }
   } 
});

module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutation
});