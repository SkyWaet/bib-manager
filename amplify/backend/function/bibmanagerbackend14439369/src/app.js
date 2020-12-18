
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var fs = require('fs')
const invertedIndex = JSON.parse(fs.readFileSync('./invertedIndex.json', 'utf-8'));
const bibFile = JSON.parse(fs.readFileSync('./global_bib.json', 'utf-8'));

// declare a new express app
var app = express()
const PORT = process.env.port||4000;
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


app.get('/item',(req,res)=>{
  res.json({"results":[{tag:'KuznetsovMYY-2020-IFAC',title:'Stability analysis of charge-pump phase-locked loops: the hold-in and pull-in ranges'}]})
})

const invertedIndexSearch = require('./invertedIndexSearch');

app.get('/bib',(req,res)=>{
  const searchResult = invertedIndexSearch(bibFile,invertedIndex,req.query.searchstring);
  console.log(searchResult);
  res.json({"results": searchResult});
})

module.exports = app
