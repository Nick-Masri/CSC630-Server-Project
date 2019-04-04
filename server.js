/*
Authors: Nicholas Masri and Nalu Concepcion
For this project, we are using express for the server, knex to write the sql code in js, and psql for the database

*/
////////////////////////////////////////////////////// SETUP ////////////////////////////////////////////////////
// Setting up express
const express = require('express')
const app = express()
const port = 8888

//Setting up pg
const {
  Client
} = require('pg')
const client = new Client()

async function connect() {
  await client.connect()
}

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
////////////////////////////////////////////////////// Database Setup ////////////////////////////////////////////////////
knex.schema.hasTable('address_tb').then(function(exists) { // Creates the table if it doesn't exists
  if (!exists) {
    return knex.schema.createTable('address_tb', function(table) {
      console.log("create address table");
      table.increments('address_id'); // Creates 'id' column on table
      table.string('adress');
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

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
})