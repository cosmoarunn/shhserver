"use strict";
const _           = require('lodash')
const path        = require('path')
const http        = require('http')
const https       = require('https')
const fs          = require('fs')
const ws          = require('ws')
const express     = require('express')
const request     = require('request')
const moment      = require('moment')
const morgan      = require('morgan')   
const cors        = require('cors')
const sessions    = require("client-sessions");
const exec        = require('child_process').exec;

const config      = require('./config.js')
const corsOptions = (config.corsEnabled)?require('./helpers/cors-helper.js'):{}

/*
* SSL Server Params
*/
var options = {
    key     : config.sslOptions.key,      
    cert    : config.sslOptions.cert,
};

var port = config.port || 3030;

var app         = express();  
app.set('superSecret', config.superSecret);

app.use(express.urlencoded({ extended: true })); // use body parser to get info from POST and/or URL parameters
app.use(express.json());

if(config.corsEnabled)
  app.use(cors()); //Use of cors for allwoed origins 

app.disable('x-powered-by');
//console.log(servConfig)

// Add custom headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'https://allowedserver.com');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});


/*
* The SESSION - store it in browser
*/
app.use(sessions({
  cookieName: 'shhAPIsessions', // cookie name dictates the key name added to the request object
  secret: config.superSecret , // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    cookie: {
      path: '/', // cookie will only be sent to requests under '/api'
      maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
      ephemeral: false, // when true, cookie expires when the browser closes
      httpOnly: true, // when true, cookie is not accessible from javascript
      secure: true // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}));

/* --------------------------------------------------
  *  Create the https server
  * --------------------------------------------------
  */
var server
var corsEnabled = (config.corsEnabled)?"(CORS Enabled)":""
if(config.https) { 
    server = https.createServer(options, app).listen(port, function(err){
      if(err) console.log(err.toString());
    console.log("HTTPS server (CORS: "+config.corsEnabled+") listening on port " + port);
  });
} else {
  server = http.createServer(options, app).listen(port, function(err){
      if(err) console.log(err.toString());
    console.log("HTTP server (CORS: "+config.corsEnabled+") listening on port " + port);
  });
}

/* --------------------------------------------------
  *  Socket for the https server
  *
  * --------------------------------------------------
  */
if(config.socketEnabled)  {
  const io        = require('socket.io')(server);
  //io.origins(config.whitelist);  //io.origins('*:*') 

  io.on('connection', (client) => { 
      client.on('subscribeTo', (interval) => {  
          setInterval(() => { 
              client.emit('pubkey' , { timestamp: new Date() , status: { success: true, msg: moment().format('MMMM Do YYYY, h:mm:ss a') } });
          }, interval);
      })
  });
}


/* --------------------------------------------------
  *  Basic Route
  *
  * --------------------------------------------------
  */
app.get('/', cors(corsOptions), function(req, res) {
    //res.send('SHH Authorization HTTPS server at https://165.22.35.93' + https_port + '/api');
      res.send("<p>  Response from HTTPS server (CORS: "+config.corsEnabled+") running at https://"+config.host+":"+config.port+"/</p>");
});


/**
 *  The Routes
 */
var baseRoute = require('./routes/base.js')
app.use('/routes/base', baseRoute)


   