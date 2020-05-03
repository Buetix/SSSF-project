'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const review = new Schema ({
    MovieTitle: String,
    MoviePoster: String,
    Comment: String,
    Author: String
});

module.exports = mongoose.model('Review', review);