

"use strict";
var Main = module.parent.exports;

Main.ActionSet = function(Child, Request){
  Main.ValidateArguments(Main.ARGS_EVEN, Request.length);
  for(let Number = 0; Number < Request.length; Number += 2){
    let Value = Main.NormalizeType(Request[Number + 1]);
    this.Database.set(Request[Number], Value);
  }
  return {Type: 'OK'};
};

Main.ActionGET = function(Child, Request){
  if(Request.length === 1){
    return this.Database.get(Request[0]) || null;
  }
  return Request.map(function(Name){
    return this.Database.get(Name) || null;
  }.bind(this));
};

Main.ActionINCR = function(Child, Request){
  if(Request.length === 1){
    let Value = this.Database.get(Request[0]) || 0;
    Main.Validate(Main.VAL_NUMERIC, 'INCR', Value);
    this.Database.set(Request[0], ++Value);
    return Value;
  }
  return Request.map(function(Name){
    let Value = this.Database.get(Name) || 0;
    Main.Validate(Main.VAL_NUMERIC, 'INCR', Value);
    this.Database.set(Request[0], ++Value);
    return Value;
  }.bind(this));
};