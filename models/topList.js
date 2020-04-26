'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topList = new Schema ({
    position: Number,
    review: [{type: mongoose.Types.ObjectId, ref: 'Review'}],
    comment: String
});

module.exports = mongoose.model('TopList', topList);