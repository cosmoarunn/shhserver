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

    BaseRouter.get('/hello', cors(),function(req, res) { 
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;        
      
        var body = rHelper.parseRequest(req); console.log(body)
        res.json({success: true, msg: "Hello from the base router!", body: JSON.stringify(body) })
          
    })

      
    

    BaseRouter.post('/getCsr', cors(),function(req, res) { 
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
       
        var bodyStr = '';
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
           var body = JSON.parse(bodyStr);
           var loc = body.loc.trim()
           var dmnParts = body.domain.split('.')
           var domain = dmnParts[0].trim()
           //if(! validateDomain(body.domain))
            //    res.json({ success: false, msg: "Domain validation failed!"})
              
           asyncExec(`cd `+loc+`; openssl genrsa 4096 > `+domain+`.key ;`)        
            .then((response) => (response)) 
                .then((response) => { 
                    console.log(response)
                    try {
                        if (fs.existsSync(loc + domain + '.key'))   //
                            asyncExec(`openssl req -new -out `+ loc + domain+`.csr -sha256 -key `+loc+domain+`.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS:`+body.domain+`,DNS:www.`+body.domain+`"))`)
                                .then((response) => (response)) 
                                    .then((response) => {
                                        if (fs.existsSync(loc+domain+'.csr')) {
                                            const csr = fs.readFileSync(loc+domain+'.csr', {encoding:'utf8', flag:'r'});
                                            res.json({ success: !response.error, msg : csr })
                                        }
                                    })
                        
                    } catch(err) {
                        console.error(err)
                    }
                    
                    
                })
        });

    })

    //Validation procedures 

    BaseRouter.post('/validateEmail', cors(corsOptions),function(req, res,err) { 
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        
        var bodyStr = '';
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
           var body = JSON.parse(bodyStr);
           if(!validateEmail(body.email))
                res.json({ success: false, msg : "Account email is invalid!" })
            else { 
                res.json({ success: true, msg : "Account email is valid!" })
            } 
        });
        req.on("error" ,(err) => { 
            res.json({ success: false, msg : "CORS error!" })
        })
        
    })

    BaseRouter.post('/validatePubKey', cors(),function(req, res) { 
        //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        var bodyStr = '';
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
             var body = JSON.parse(bodyStr);
             
             if(body.pubkey)
              SslGenerator.validatePublicKey(body.pubkey, body.email)
                .then((response) => (response)) 
                  .then((response) => {
                    res.json(response)
                  })
        })

    })

    //openssl req -subject  -text -out webdrumbeats.parsed  -verify -in /opt/webdrumbeats.csr -keyform PEM -key webdrumbeats.key
    BaseRouter.post('/validateCsr', cors(),function(req, res) { 
        //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        var bodyStr = ''; 
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
             var body = JSON.parse(bodyStr);  
             console.log("Domain Validation: " + SslGenerator.validateDomain(body.domain))
             var loc = body.loc.trim(), csr = body.csr
             var dmnParts = body.domain.split('.')
             var domain = dmnParts[0].trim(), file = loc+domain+'.csr'
             if (true) { //SslGenerator.validateDomain(body.domain)) { 
                SslGenerator.writeFile(file, csr)
                  .then((response) => (response))
                    .then((response) => { 
                    SslGenerator.asyncExec(`openssl req -subject  -text -out `+loc+domain+`.parsed  -verify -in `+loc+domain+`.csr -keyform PEM -key `+loc+domain+`.key`)
                        .then((response) => (response))
                            .then((response) => { 
                                if(response.msg == 'verify OK\n')
                                    SslGenerator.validateCsr(body)
                                        .then((response) => (response))
                                            .then((response) => { //console.log(response)
                                                res.json(response)
                                            })
                                
                            }) 
                    
                })
            }
        })

    })

    //Validate Registration, Update Account Contact (POST /ACCOUNT['account_uri'])
    BaseRouter.post('/updateAccount', cors(),function(req, res) { 
        //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        var bodyStr = ''; 
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
             var body = JSON.parse(bodyStr);  
             //console.log("Domain Validation: " + SslGenerator.validateDomain(body.domain))
             var loc = body.loc.trim(), csr = body.csr
             var dmnParts = body.domain.split('.')
             var domain = dmnParts[0].trim()
             var account = body.account, dirs = body.directories
             if (true) { //SslGenerator.validateDomain(body.domain)) { 
                SslGenerator.validateRegistrationAndUpdateContact(loc, dirs, account)
                  .then((response) => (response))
                    .then((response) => { 
                       res.json(response)
                    
                })
            }
        })

    })
    //To parse the CSR 
    BaseRouter.post('/parseCsr', cors(),function(req, res) { 
        //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        var bodyStr = ''; 
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
             var body = JSON.parse(bodyStr);  
             console.log("Domain Validation: " + SslGenerator.validateDomain(body.domain))
             var loc = body.loc.trim()
             var dmnParts = body.domain.split('.')
             var domain = dmnParts[0].trim(), parsed = loc+domain+'.parsed';
             
             SslGenerator.parseCSRFingerPrint(parsed)

        })

    })


    BaseRouter.post('/directories', cors(),function(req, res) { 
        //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        var bodyStr = ''; 
        req.on("data",function(chunk){
            bodyStr += chunk.toString();
        });
        req.on("end",function(){
             var body = JSON.parse(bodyStr);
             var email = body.email, domain = body.domain
             //Get BaseRouter directories
             SslGenerator.getDirectories()
                .then((resp) => (JSON.parse(resp)))
                    .then((dirs) => { 
                        if(dirs) { //console.log(dirs)
                            res.json({success: true, dirs: dirs })
                        }
                    })
        }) 

    })

function parseRequest(req) { 
    var bodyStr = '';
        req.on("data",function(chunk){
            bodyStr += chunk.toString()
        });
        
    if (bodyStr.length) 
        return JSON.parse(bodyStr)
}

    
function execute(command) {
      return new Promise(function(resolve, reject) {
        exec(command, {shell: "/bin/bash"},  function(error, standardOutput, standardError) { 
          if (error) 
            reject(error)

          if (standardError) 
            reject(standardError)

          resolve(standardOutput);
        });
      })
   }

    async function asyncExec(cmd) {
      try {
        return await execute(cmd) //"openssl genrsa 4096 > account.key | openssl rsa -in account.key -pubout");
      } catch (error) {
        return { error: true, msg : error.toString() }
      }
    }
    
    function validateEmail(em) { 
        // validate email
        var email_re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return (email_re.test(em)) ?1:0;
    }

    function validateDomain(domain) { 
        var domain_re = /^([a-z0-9]([-a-z0-9]*[a-z0-9])?\\.)+((a[cdefgilmnoqrstuwxz]|aero|arpa)|(b[abdefghijmnorstvwyz]|biz)|(c[acdfghiklmnorsuvxyz]|cat|com|coop)|d[ejkmoz]|(e[ceghrstu]|edu)|f[ijkmor]|(g[abdefghilmnpqrstuwy]|gov)|h[kmnrtu]|(i[delmnoqrst]|info|int)|(j[emop]|jobs)|k[eghimnprwyz]|l[abcikrstuvy]|(m[acdghklmnopqrstuvwxyz]|mil|mobi|museum)|(n[acefgilopruz]|name|net)|(om|org)|(p[aefghklmnrstwy]|pro)|qa|r[eouw]|s[abcdeghijklmnortvyz]|(t[cdfghjklmnoprtvwz]|travel)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])$/i;
        return (domain_re.test(domain)) ?1:0;
    }
       
        
    

    

module.exports = BaseRouter