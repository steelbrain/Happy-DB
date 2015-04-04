

"use strict";
var Main = module.parent.exports;

Main.ActionSET = function(Request){
  Main.ValidateArguments(Main.ARGS_EVEN, Request.length);
  for(let Number = 0; Number < Request.length; Number += 2){
    let Value = Main.NormalizeType(Request[Number + 1]);
    this.Database.set(Request[Number], Value);
  }
  return {Type: 'OK'};
};

Main.ActionGET = function(Request){
  if(Request.length === 1){
    return this.Database.get(Request[0]) || '';
  }
  return Request.map(function(Name){
    return this.Database.get(Name) || '';
  }.bind(this));
};

Main.ActionINCR = function(Request){
  if(Request.length === 1){
    let Value = this.Database.get(Request[0]) || 0;
    Main.Validate(Main.VAL_NUMERIC, 'INCR', Value);
    this.Database.set(Request[0], ++Value);
    return Value;
  }
  return Request.map(function(Name){
    let Value = this.Database.get(Name) || 0;
    Main.Validate(Main.VAL_NUMERIC, 'INCR', Value);
    this.Database.set(Name, ++Value);
    return Value;
  }.bind(this));
};

Main.ActionDEL = function(Request){
  let Length = 0;
  Request.forEach(function(Name){
    this.Database.delete(Name);
    Length ++;
  }.bind(this));
  return Length;
};

Main.ActionEXPIRE = function(Request){
  Main.ValidateArguments(Main.ARGS_EVEN, Request.length);
  for(let Number = 0; Number < Request.length; Number += 2){
    let Key = Request[Number];
    let Value = Main.NormalizeType(Request[Number + 1]);
    if(typeof Value !== 'number')
      throw new Error("EXPIRE Expects even parameters to be numeric");
    clearTimeout(Main.Timeouts[Key]);
    Main.Timeouts[Key] = setTimeout(function(Key){
      Main.ActionDEL.call(this, [Key]);
    }.bind(this, Key), Value * 1000);
  }
  return {Type: 'OK'};
};

Main.ActionPING = function(){
  return 'PONG';
};