/**
 *  
 * 
 * 
 *  Cors Helper
 * 
 */
const config      = require('../config.js')

const whitelist = config.allowedOrigins

module.exports = function(whitelist) { 
  return {
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
} 