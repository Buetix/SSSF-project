'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topList = new Schema ({
    listName: String,
    review: [{type: mongoose.Types.ObjectId, ref: 'Review'}],
    comment: String,
    author: String
});

module.exports = mongoose.model('TopList', topList);