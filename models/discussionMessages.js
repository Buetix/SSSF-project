'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionMessages = new Schema ({
   ParentID: String,
   Message: String,
   Author: String
});

module.exports = mongoose.model('Discussion', discussionMessages);