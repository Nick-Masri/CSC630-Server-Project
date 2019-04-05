/*
Authors: Nicholas Masri and Nalu Concepcion
For this project, we are using express for the server,
knex to write the sql code in js, and psql for the database
*/

// Camel Case user inputs, snake case column names
// Ex: userName, user_name
////////////////////////////////////////////////////// SETUP ////////////////////////////////////////////////////
// Setting up express
const express = require('express')
const app = express()
const port = 8888

// Setting up geocoder
var nodeGeoCoder = require('node-geocoder'); // https://www.npmjs.com/package/node-geocoder

var geocoder = nodeGeoCoder({
  provider: 'google',
  apiKey: 'AIzaSyCZAf308qLzlbq4JTsYWeL4NVBc4joHwnk'
});

//Setting up bodyparser, from: https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90
var bodyParser = require('body-parser');

app.use(bodyParser.json())

//Setting up knex
var knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'ec2-54-83-61-142.compute-1.amazonaws.com',
    user: 'tsnaczvmpvpzcf',
    password: 'e282b333628a84cf0bf40e09e8aac7205f8222b6d09ad0d0ba5a076f7c34f28b',
    database: 'dfi4e39vngk2b5'
  }
});
//Setting up pg
const {
  Client
} = require('pg')
const client = new Client()

async function connect() {
  await client.connect()
}

////////////////////////////////////////////////////// Database Setup ////////////////////////////////////////////////////
knex.schema.hasTable('address_tb').then(function(exists) { // Creates the table if it doesn't exists
  if (!exists) {
    return knex.schema.createTable('address_tb', function(table) {
      console.log("created address table");
      table.increments('address_id'); // Creates 'id' column on table
      table.string('address_name');
      table.string('address');
      table.string('user_id_ref');
      table.decimal('long', 9, 6);
      table.decimal('lat', 9, 6);
    });
  }
});

knex.schema.hasTable('users_tb').then(function(exists) { // Creates the table if it doesn't exists
  if (!exists) {
    return knex.schema.createTable('users_tb', function(table) {
      console.log("Created user table");
      table.increments('user_id'); // Creates 'id' column on table
      table.string('display_name');
      table.string('user_name');
      table.decimal('long', 9, 6);
      table.decimal('lat', 9, 6);
    });
  }
});
////////////////////////////////////////////////////// Routing ////////////////////////////////////////////////////

app.get('/', function(req, res) {
  res.send('<p>Welcome to the homepage for project 1. <a href= "/address_tb">View Address Database</a>  <a href= "/users_tb">View Useds Database</a></p>')
})

//////////////// Addresses ////////////////
// Allow Creation of Addresses
app.post("/address/create", function(req, res) {
  geocoder.geocode(req.body.address, function(err, result) {
    knex('address_tb').insert({
      address: req.body.address,
      address_name: req.body.addressName,
      user_id_ref: req.body.userIdRef,
      long: result[0]['longitude'],
      lat: result[0]['latitude']
    }).then(function() {
      res.status(200).send('Succesfully Created Entry in Addresses Table');
    })
  });
});

// Update address
app.post("/address/update", function(req, res) {
  geocoder.geocode(req.body.address, function(err, result) {
    knex('address_tb').where("address_id", "=", req.body.addressID).update({
      address: req.body.address,
      address_name: req.body.addressName,
      user_id_ref: req.body.userIdRef,
      long: result[0]['longitude'],
      lat: result[0]['latitude']
    }).then(function() {
      res.status(200).send('Succesfully Updated Entry in Addresses Table');
    })
  });
});

//Delete address
app.post("/address/delete", function(req, res) {
  knex('address_tb').where("address_id", "=", req.body.addressID).del().then(function() {
    res.status(200).send('Succesfully Deleted Entry in Addresses Table');
  })
});

// Returns a JSON list of all addresses
app.get("/address_tb", function(req, res) {
  var table = knex.select().table('address_tb')
  res.json(table.rows)
});


//////////////// Users ////////////////

// Allow Creation of Users
app.post("/user/create", function(req, res) {
  knex('users_tb').insert({
    display_name: req.body.displayName,
    user_name: req.body.userName,
    long: req.body.long,
    lat: req.body.lat
  }).then(function() {
    res.status(200).send('Succesfully Created Entry in Users Table');
  })
});

// Update User
app.post("/user/update", function(req, res) {
  knex('users_tb').where("user_id", "=", req.body.userId).update({
    display_name: req.body.displayName,
    user_name: req.body.userName,
    long: req.body.long,
    lat: req.body.lat
  }).then(function() {
    res.status(200).send('Succesfully Updated Entry in Users Table');
  })
});

//Delete User
app.post("/user/delete", function(req, res) knex('users_tb').where("user_id", "=", req.body.userId).del().then(function() {
  res.status(200).send('Succesfully Deleted Entry in Users Table');
})
});

// Returns a JSON list of a single userIdRef
app.get("/user/:username", function(req, res) {
  var table = knex.select().table('users_tb')
  res.json(table.rows)
});

// Returns a JSON list of all users
app.get("/user_tb", function(req, res) {
  var table = knex.select().table('users_tb')
  res.json(table.rows)
});


// Listen on port
app.listen(process.env.PORT || port, function() {
  console.log(`App listening on port ${port}!`)
})