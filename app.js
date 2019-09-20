'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');


const util = require('./util/util');

const app = express();
//const events = [];

app.use(bodyParser.json());
// REST API
app.get('/', (req, res, next) => {
  res.end('Hello world!');
});
// graphQL API
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find()
      .then(events => {
        return events.map(event => {
          return {...event._doc};
        });
      })
      .catch(err => {
        throw err; // express will catch this err and pass down to error handler
      });
    },
    createEvent: (args) => {
      // const event = {
      //   _id: Math.random().toString(),
      //   title: args.eventInput.title,
      //   description: args.eventInput.description,
      //   price: +args.eventInput.price,
      //   date: args.eventInput.date
      // };
      // console.log(args);
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date)
      });
      // return a promise
      return event.save()
      .then(result => {
        console.log(result);
        return {...result._doc};
      })
      .catch(err => {
        console.log(err);
        throw err;
      });

    },
    createUser: (args) => {
      return bcrypt.hash(args.userInput.password, 12)
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword
        });
        return user.save();
      })
      .then((result) => {
        return {...result._doc, _id: result.id};        
      })
      .catch((err) => {
        throw err;
      });

    }
  },
  graphiql: true
}));



// log errors
app.use(util.logErrors);
app.use(util.clientErrorHandler);
// catch 404 and forward to error handler
app.use(util.error404Handler);
// final error handler
// configuration for development environment
if(process.env.NODE_ENV === 'development') {
   console.log("running in development environment");
   app.use(express.errorHandler());
 };
// Set the environment variable NODE_ENV to production, to run the app in production mode.
// configuration for production environment (NODE_ENV=production)
if(process.env.NODE_ENV === 'production') {
   console.log("running in production environment");
   // configure a generic 500 error message
   app.use(util.finalErrorHandler);
};


module.exports = app;
