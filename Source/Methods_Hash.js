

"use strict";
var Main = module.parent.exports;

Main.ActionHSET = function(Request){
  if(Request.length < 3){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  Main.ValidateArguments(Main.ARGS_ODD, Request.length);
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  try {
    Main.Validate(Main.VAL_HASH, 'HSET', Value);
  } catch(err){
    Value = new Map();
    this.Database.set(Key, Value);
  }
  for(let Number = 0; Number < Request.length; Number += 2){
    let HValue = Main.NormalizeType(Request[Number + 1]);
    Value.set(Request[Number], HValue);
  }
  return {Type: 'OK'};
};

Main.ActionHGET = function(Request){
  let Key = Request.shift();
  let Value = this.Database.get(Key);

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HGET', Value);

  if(Request.length === 1){
    return Value && Value.get(Request[0]) || '';
  } else {
    return Request.map(function(Key){
      return Value && Value.get(Key) || '';
    });
  }
};

Main.ActionHDEL = function(Request){
  if(Request.length < 2){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  let Length = 0;
  let Key = Request.shift();
  let Value = this.Database.get(Key);

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HDEL', Value);
  else
    return Length;

  Request.forEach(function(Name){
    Value.delete(Name);
    Length ++;
  }.bind(this));
  return Length;
};