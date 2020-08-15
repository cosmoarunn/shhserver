/**
 *  
 * 
 * 
 *  Router Functions Helper
 * 
 */


module.exports = { 
  empty : function(_obj) { 
    if("undefined" === typeof _obj || _obj === "" || null === _obj)
      return true
    else 
      return false
  },

  //Read express web request
  parseRequest: function(req, callback) { 
    var body = {}, bodyStr = '', err;
    try { 
        req.on("data",function(chunk){
            bodyStr += chunk.toString()
        })
        req.on("end",function(){
            var body = JSON.parse(bodyStr)
            callback( false, body)
        })
    } catch(err) { console.log(err)
        callback(err, false)
    }
  }
}