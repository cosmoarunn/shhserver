const path        = require('path');
const express     = require('express');
const fs          = require('fs');

const Promise     = require('promise');
const request     = require('request');
const cors        = require('cors');
const config      = require('../config')
const jwt         = require('jsonwebtoken');
const exec        = require('child_process').exec;

//const SslGenerator   = require('../lib/SslGenerator')
const rHelper     = require('../helpers/router-helper')

//Route
const BaseRouter   = express.Router();

/*
* SSL Server Params
*/
var options = {
    key     : config.sslOptions.key,
    cert    : config.sslOptions.cert,
};

/*
* Cors Options
*/ 
var whitelist = config.allowedOrigins //
//console.log(whitelist);
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            console.log(origin)
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }, 
    optionsSuccessStatus: 200,
    //origin: "*:*"
}

    //A Simple get to base
    BaseRouter.get('/', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)

        res.json({success: true, msg: "Base router received your request and responds!" })
          
    })

    //A Simple 'hello' get
    BaseRouter.get('/hello', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
        res.json({success: true, msg: "Hello from the base router!" })
    })

    //A Simple get for JSON file
    BaseRouter.get('/api-test', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
        var jsonApi = JSON.parse(fs.readFileSync(path.resolve('./test.json')))
        res.json({success: true, msg: JSON.stringify(jsonApi) })
          
    })
    //A Simple post
    BaseRouter.post('/post-base', cors(),function(req, res) { 
      var ip = rHelper.getIP(req)
      rHelper.parseRequest(req, function(isJSON, data) { 
        var body = (isJSON)?JSON.stringify(data):data
        res.json({success: true, msg: "Post request to base", body: body })
      });
      
    })

module.exports = BaseRouter
