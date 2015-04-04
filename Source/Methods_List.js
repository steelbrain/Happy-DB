

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

Main.ActionLPOP = function(Request){
  Main.ValidateArguments(1, Request.length);
  let Value = this.Database.get(Request.shift());

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_LIST, 'LPOP', Value);

  return (Value && Value.shift()) || '';
};

Main.ActionRPUSH = function(Request){
  if(Request.length < 2){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  try {
    Main.Validate(Main.VAL_LIST, 'RPUSH', Value);
  } catch(err){
    Value = [];
    this.Database.set(Key, Value);
  }
  Request.reverse().forEach((Item) => Value.unshift(Item));
  return {Type: 'OK'};
};