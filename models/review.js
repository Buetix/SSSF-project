'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const review = new Schema ({
    movieTitle: String,
    moviePoster: String,
    comment: String
});

module.exports = mongoose.model('Review', review);