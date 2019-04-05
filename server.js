/*
Authors: Nicholas Masri and Nalu Concepcion
For this project, we are using express for the server, knex to write the sql code in js, and psql for the database
*/
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
    host: 'localhost',
    user: 'postgres',
    password: 'nick123',
    database: 'project1'
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
      table.string('long');
      table.string('lat');
    });
  }
});

knex.schema.hasTable('users_tb').then(function(exists) { // Creates the table if it doesn't exists
  if (!exists) {
    return knex.schema.createTable('users_tb', function(table) {
      console.log("Created user table");
      table.increments('user_id'); // Creates 'id' column on table
      table.string('display_name');
      table.string('username');
      table.string('long');
      table.string('lat');
    });
  }
});
////////////////////////////////////////////////////// Routing ////////////////////////////////////////////////////

app.get('/', function(req, res) {
  res.send('<p>Welcome to the homepage for project 1. <a href= "/addresses">View Address Database</a> [Insert links to DB]</p>')
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
  knex.select().table('address_tb').then(function(result) {
    res.json(result.rows);
  })
});

//
// // ** CRUD Users **
//
// // Creates a User
// app.post("/user/create", function(req, res) {
//   client.query(`INSERT INTO Users (DisplayName,UserName,Lat,Long) VALUES ('${req.body.displayName}','${req.body.userName}',${req.body.lat},${req.body.long});`, function(err, result) {
//     console.log("Created USER");
//     res.sendStatus(200);
//   });
// });
//
// // Updates a User
// app.post("/user/update", function(req, res) {
//   client.query(
//     `UPDATE Users
//     SET DisplayName = '${req.body.displayName}', UserName = '${req.body.userName}', Lat = ${req.body.lat}, Long = ${req.body.long}
//     WHERE UserID = ${req.body.userID};`,
//     function(err, result) {
//       console.log("Updated USER");
//       res.sendStatus(200);
//     });
// });
//
// // Deletes a User
// app.post("/user/delete", function(req, res) {
//   client.query(
//     `DELETE FROM Users
//     WHERE UserID = '${req.body.userID}';`,
//     function(err, result) {
//       console.log("Deleted USER");
//       res.sendStatus(200);
//     });
// });
//
// // Gets a User
// app.get("/user/:username", function(req, res) {
//   client.query(`SELECT * FROM Users WHERE Users.UserName='${req.params.username}'`, function(err, result) {
//     res.json(result.rows); // Return result of SQL query
//   });
// });
//
// // Gets all Users
// app.get("/user_table", function(req, res) {
//   client.query("SELECT * FROM Users", function(err, result) {
//     res.json(result.rows); // Return result of SQL query
//   });
// });

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
})