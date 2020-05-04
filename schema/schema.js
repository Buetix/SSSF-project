'use strict';


const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema, GraphQLNonNull} = require(
    'graphql');

const review = require('../models/review');
const topList = require('../models/topList');
const user = require('../models/userModel');
const messages = require('../models/discussionMessages');

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

const messagesType = new GraphQLObjectType({
   name: 'discussion',
   description: 'Conversation under a topList',
   fields: () => ({
       id: {type: GraphQLID},
       ParentID: {type: GraphQLID},
       Message: {type: GraphQLString},
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
       Author: {type: GraphQLString},
       Tags: {type: new GraphQLList(GraphQLString)},
       Discussion: {type: new GraphQLList(messagesType)}
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
               Author: {type: new GraphQLNonNull(GraphQLString)},
               Tags: {type: new GraphQLList(GraphQLString)},
               Discussion: {type: new GraphQLList(GraphQLString)}
           },
           resolve: async (parent, args, {req, res, checkAuth}) => {
               try {
                   checkAuth(req, res);
                   args.Discussion = [];
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
           args: {ListName: {type: new GraphQLNonNull(GraphQLID)}},
           resolve: async (parent, args, {req, res, checkAuth}) => {
               try {
                   checkAuth(req, res);
                   return await topList.findByIdAndDelete(args.ListName, args, {new:true});
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
       },
       leaveComment: {
           type: messagesType,
           description: 'leave a comment on a topList',
           args: {
               ParentID: {type: new GraphQLNonNull(GraphQLID)},
               Message: {type: new GraphQLNonNull(GraphQLString)},
               Author: {type: new GraphQLNonNull(GraphQLString)}
           },
           resolve: async (parent, args, {req, res, checkAuth}) => {
               try {
                   checkAuth(req, res);
                   const newComment = new messages(args);
                   await newComment.save();

                   return await topList.findByIdAndUpdate(
                       {_id: args.ParentID},
                       {$addToSet: {"Discussion": newComment}},
                       {new: true},
                       (error, doc) => {
                           console.log(error);
                           return new Error(error);
                       }
                   );
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