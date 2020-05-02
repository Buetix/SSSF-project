'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topList = new Schema ({
    ListName: String,
    Reviews: [{type: mongoose.Types.ObjectId, ref: 'Reviews'}],
    Comment: String,
    Author: String
});

module.exports = mongoose.model('TopList', topList);