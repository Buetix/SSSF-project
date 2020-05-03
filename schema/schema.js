﻿'use strict';


const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull} = require(
    'graphql');

const review = require('../models/review');
const topList = require('../models/topList');
const user = require('../models/userModel');

const userType = new GraphQLObjectType( {
   name: 'user',
   description: 'A user',
   fields: () => ({
       username: {type: GraphQLString},
       email: {type: GraphQLString},
       password: {type: GraphQLString}
   })
});

const reviewType = new GraphQLObjectType({
   name: 'review',
   description: 'A single review of a movie',
   fields: () => ({
       id: {type: GraphQLID},
       MovieTitle: {type: GraphQLString},
       MoviePoster: {type: GraphQLString},
       Comment: {type: GraphQLString},
       Author: {type: GraphQLString}
   })
});

const topListType = new GraphQLObjectType({
   name: 'topList',
   description: 'A list containing 10 reviews',
   fields: () => ({
       id: {type: GraphQLID},
       ListName: {type: GraphQLString},
       Reviews: {
           type: new GraphQLList(reviewType),
           resolve: async (parent, args) => {
               try {
                   return await review.find({_id: parent.Reviews});
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
           type: topListType,
           description: 'Get a specific list',
           args: {
               ListName: {type: GraphQLString}
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
           
       },
       reviews: {
           type: new GraphQLList(reviewType),
           description: 'Get all reviews',
           resolve: async (parent, args) => {
               try {
                   return await review.find();
               } catch (e) {
                   return new Error(e.message);
               }
           }
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
               ListName: {type: GraphQLString},
               Reviews: {
                   type: new GraphQLNonNull(
                       new GraphQLList(GraphQLID)
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
       },
       deleteTopList: {
           type: topListType,
           description: 'Delete existing list',
           args: {id: {type: new GraphQLNonNull(GraphQLID)}},
           resolve: async (parent, args, {req, res, checkAuth}) => {
               try {
                   checkAuth(req, res);
                   return await topList.findByIdAndDelete(args.id, args, {new:true});
               } catch (e) {
                   return new Error(e.message);
               }
           }
       },
       createReview: {
           type: reviewType,
           description: 'Create a single review',
           args: {
               MovieTitle: {type: new GraphQLNonNull(GraphQLString)},
               MoviePoster: {type: new GraphQLNonNull(GraphQLString)},
               Comment: {type: new GraphQLNonNull(GraphQLString)},
               Author: {type: new GraphQLNonNull(GraphQLString)}
           },
           resolve: async (parent, args, {req, res, checkAuth}) => {
               try {
                   checkAuth(req, res);
                   const newReview = new review(args);
                   return await newReview.save();
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