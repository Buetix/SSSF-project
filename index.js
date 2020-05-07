'use strict';

require('dotenv').config();
const express = require('express');
const expressGraphQL = require('express-graphql');
const db = require('./models/db');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');
const passport = require('./utils/pass');
const app = express();
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(helmet());

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
   process.env.NODE_ENV = process.env.NODE_ENV || "development";
   if (process.env.NODE_ENV === "production") {
      require("./production")(app, process.env.PORT);
   } else {
      require("./localhost")(
          app,
          process.env.HTTPS_PORT,
          process.env.HTTP_PORT
      );
   }
});

app.use(express.static(__dirname + '/public'));
app.use('/auth', require('./routes/authRoute'));
app.use('/user', require('./routes/userRoute'));