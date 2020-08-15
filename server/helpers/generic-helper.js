/**
 *  
 * 
 * 
 *  Generic Functions Helper
 * 
 */


module.exports = { 
  empty : function(_obj) { 
    if("undefined" === typeof _obj || _obj === "" || null === _obj)
      return true
    else 
      return false
  },
  
}