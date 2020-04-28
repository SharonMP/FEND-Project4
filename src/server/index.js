const dotenv = require('dotenv');
dotenv.config();

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')

const app = express()
app.use(express.static('dist'))

var aylien = require("aylien_textapi");

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const textapi = new aylien({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY
});

app.get('/', function (req, res) {
  res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
let server = app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

// GET route
app.get('/all', sendData);
function sendData(request, response) {
  response.send(projectData);
}

// POST route
app.post('/add', addSummaryData);
function addSummaryData(request, response) {
  const body = request.body;
  projectData = {sentences: body.sentences};
}

// POST route
app.post('/summarize', callAylien);
function callAylien(request, response) {
  const body = request.body;

  textapi.summarize({
    url: body.url,
    sentences_number: 3
  }, function(error, responseSummary) {
    if (error === null) {
      response.send(responseSummary);
    } else {
      console.log("ERROR in callAylien");
      response.send("ERROR");
    }
  });
}

module.exports = server