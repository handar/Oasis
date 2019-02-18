// jshint esverison: 6

const express = require('express');
const app = express();
const port = 3000;


// index/homepage routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// about: Ratna Lama
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ratnalama.html');
});

// about: Hadia Andar
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/hadiaandar.html');
});

// about: Adam Tremarche
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/adamtremarche.html');
});

// about: Andrew document.setAttribute('attr', value);rmiento
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/andrewsarmiento.html');
});

// about: Ade Adetayo
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/adeadetayo.html');
});

// about: Shuyuan Deng
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/shuyuandeng.html');
});

// listen from express module
app.listen(port, function () {
  console.log('App listening on port ${port}!...');
});
