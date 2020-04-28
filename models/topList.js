'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topList = new Schema ({
    ListName: String,
    Review: [{type: mongoose.Types.ObjectId, ref: 'Review'}],
    Comment: String,
    Author: String
});

module.exports = mongoose.model('TopList', topList);