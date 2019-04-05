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
  apiKey: 'AIzaSyCZAf308qLzlbq4JTsYWeL4NVBc4joHwnk',
});

//Setting up bodyparser, from: https://medium.com/@adamzerner/how-bodyparser-works-247897a93b90
var bodyParser = require('body-parser');

app.use(bodyParser());

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
      console.log("create address table");
      table.increments('address_id'); // Creates 'id' column on table
      table.string('address_name');
      table.string('address');
      table.string('user_id_ref');
      table.integer('long');
      table.integer('lat');
    });
  }
});

knex.schema.hasTable('users_tb').then(function(exists) { // Creates the table if it doesn't exists
  if (!exists) {
    return knex.schema.createTable('users_tb', function(table) {
      console.log("create user table");
      table.increments('user_id'); // Creates 'id' column on table
      table.string('display_name');
      table.string('username');
      table.integer('long');
      table.integer('lat');
    });
  }
});
////////////////////////////////////////////////////// Routing ////////////////////////////////////////////////////

app.get('/', function(req, res) {
  res.send('<p>Welcome to the homepage for project 1. [Insert links to DB]</p>')
})

app.get('/:name/poi', function(req, res) {
  res.send('This should send a JSON list of all the users locations')
})


//////////////// Addresses ////////////////
// Create request for address table

// app.post("/address/create", function(req, res) {
//   console.log(req.forms)
// });

app.post("/address/create", function(req, res) {
  console.log(req)
  geocoder.geocode(req.body.address, function(err, result) {
    knex('address_tb').insert([{
        address: req.body.address
      },
      {
        address_name: req.body.addressName
      },
      {
        user_id_ref: req.body.userIdRef
      },
      {
        lat: result[0]
      },
      {
        long: result[1]
      }
    ]).then(function() {
      res.status(200).send('Succesfully Created Entry in Addresses Table');
    })
  });
});


//
// //Update address
// app.post("/address/update", function(req, res) {
//   geocoder.geocode(req.body.address, function(err, result) {
//     client.query(
//       `UPDATE Addresses
//       SET AddressTitle = '${req.body.addressTitle}', Address = '${req.body.address}', Lat = ${result[0].latitude}, Long = ${result[0].longitude}, UserID = ${req.body.userID}
//       WHERE AddressID = ${req.body.addressID};`,
//       function(err, result) {
//         console.log("Updated Address");
//         res.sendStatus(200);
//       });
//   });
// });
//
// //Delete address
// app.post("/address/delete", function(req, res) {
//   client.query(`DELETE FROM Addresses WHERE AddressID=${req.body.addressID}`, function(err, result) {
//     console.log("Deleted Address");
//     res.sendStatus(200);
//   });
// });
//
// // Returns a JSON list of all the user’s locations.
// app.get("/:username/poi", function(req, res) {
//   client.query(`SELECT AddressTitle,Address,Addresses.Lat,Addresses.Long FROM Users JOIN Addresses ON Users.UserID=Addresses.UserID WHERE Users.UserName='${req.params.username}'`, function(err, result) {
//     res.json(result.rows);
//   });
// });
//
// // Returns a JSON list of all addresses
// app.get("/addresses", function(req, res) {
//   client.query("SELECT * FROM Addresses", function(err, result) {
//     res.json(result.rows);
//   });
// });
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