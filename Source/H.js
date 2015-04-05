

// @Compiler-Transpile "true"
// @Compiler-Output "../Dist/H.js"
"use strict";
class H{
  static String(Value){
    if(typeof Value === 'undefined' || typeof Value === 'bool'){
      return null;
    }
    return Value;
  }
}

module.exports = H;