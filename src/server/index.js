const dotenv = require('dotenv');
dotenv.config();

var path = require('path')
const express = require('express')
const mockAPIResponse = require('./mockAPI.js')

const app = express()

app.use(express.static('dist'))

console.log(__dirname)

var aylien = require("aylien_textapi");

console.log(`Your API key is ${process.env.API_KEY}`);
const textapi = new aylien({
application_id: process.env.API_ID,
application_key: process.env.API_KEY
});

/*
// Example from https://docs.aylien.com/textapi/sdks/#node-js-sdk
const result = textapi.sentiment({
  'text': 'John is a very good football player!'
}, function(error, response) {
  if (error === null) {
    console.log(response);
  }
});
console.log('result: ' + result);
*/

app.get('/', function (req, res) {
    // res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
let server = app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})

module.exports = server