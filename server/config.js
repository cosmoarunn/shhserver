/**
 * 
 *  
 * 
 * 
 *  Server Configuration file
 *  Author : Arun Panneerselvam
 */

const path = require('path');
const fs = require('fs');

module.exports =  { 
        
        host: getHost(),
        port: 10010,
        allowedOrigins : ['httpsgen.arunpanneerselvam.com','https://httpsgen.arunpanneerselvam.com/', 'https://165.22.35.93:4040','https://arunpanneerselvam.com', 'https://gsunitedtechnologies.com'],
        superSecret:  '8m9u4L4VeiWkPLXEoWAbvwzb-nyw6eA2Nz1gUgNR45ytAcc1PHzFLomeYhFc6whQ4ieWpHAwF1WeZgFCqp316o8W00054587Q1m=',
        auth_duration : 30000, 
        //socket: 'https://' + getHost() + ':3030',
        https: true,
        socketEnabled: true,
        corsEnabled: false,
        sslEnabled: true,
        sslOptions: { 
            key :  fs.readFileSync(path.resolve('./ssh/key.pem')),
            cert:  fs.readFileSync(path.resolve('./ssh/cert.pem')) 
        },
} 

function getHost(name) {
  return process.env.CI === 'true' ? name : '127.0.0.1';
}

