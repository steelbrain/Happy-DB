

"use strict";
var Main = module.parent.exports;

Main.ActionLPUSH = function(Request){
  if(Request.length < 2){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  try {
    Main.Validate(Main.VAL_LIST, 'LPUSH', Value);
  } catch(err){
    Value = [];
    this.Database.set(Key, Value);
  }
  Request.forEach((Item) => Value.push(Item));
  return {Type: 'OK'};
};

Main.ActionRPUSH = function(Request){
  if(Request.length < 2){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  try {
    Main.Validate(Main.VAL_LIST, 'LPUSH', Value);
  } catch(err){
    Value = [];
    this.Database.set(Key, Value);
  }
  Request.reverse().forEach((Item) => Value.unshift(Item));
  return {Type: 'OK'};
};