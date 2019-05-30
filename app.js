const express = require("express");
const bodyParser = require("body-parser");

// GRAPHQL
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

// MONGO
const mongoose = require("mongoose");

// BCRYPT for password hashing.
const bcrypt = require("bcryptjs");

// IMPORT MODELS
const Table = require("./models/table");
const User = require("./models/user");

const app = express();

// configure graphql schema
app.use(
  "/api",
  graphqlHttp({
    /*
    Schema, rootvalue and graphiql
    schema use buildSchema function which takes a string as schema
    rootvalue has all the queries and mutations logic
  */

  schema: buildSchema(`
    type Item{
      
    }

    type rootQuery: {
      items: [Item!]
    }

    type rootMutation: {
      orderItems(itemID, itemName, itemPrice): Item
    }

    schema: {
      query: rootQuery,
      mutation: rootMutation
    }
  `),
  rootValue: ,
  graphiql: true
  })
);

// gives error when used with template strings. not able to use env variables
mongoose
  .connect(
    `mongodb+srv://ashish:eb5CT2mv7vz1h7Ph@cluster0-b4fmv.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(err => {
    console.log(err);
  });
