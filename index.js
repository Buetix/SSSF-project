'use strict';

require('dotenv').config();
const express = require('express');
const expressGraphQL = require('express-graphql');
const db = require('./models/db');
const helmet = require('helmet');
const schema = require('./schema/schema');
const passport = require('./utils/pass');
const app = express();
const cors = require('cors');

app.use(cors);
app.use(helmet);

app.get('/', (req, res) => {
   res.send('Hello world') 
});

const checkAuth = (req, res) => {
   passport.authenticate("jwt", {session: false}, (err, user) => {
      if (err || !user) {
         throw new Error("User not authorized")
      }
   })
};

app.use('/graphql', (req, res) => {
   expressGraphQL({
      schema: schema,
      graphiql: true,
      context: {req, res, checkAuth}
   })(req, res);
});

db.on('connected', () => {
   app.listen(3000, () => console.log(`Example app listening on port 3000!`));
});

app.use('/auth', require('./routes/authRoute'));