

"use strict";
var Main = module.parent.exports;

Main.ActionSet = function(Child, Request, Message){
  if(Request.length % 2 !== 0)
    throw new Error("Invalid Parameter length, Parameter number should be even");
  for(let Number = 0; Number < Request.length; Number += 2){
    let Value = Request[Number + 1];
    let ValueInt = parseInt(Value);
    if(!isNaN(ValueInt) && ValueInt.toString() === Value){
      this.Database.set(Request[Number], ValueInt);
    } else {
      this.Database.set(Request[Number], Value);
    }
  }
  Message.Result = {Type: 'OK'};
  Child.Finished(Message);
};

Main.ActionGET = function(Child, Request, Message){
  if(Request.length === 1){
    Message.Result = this.Database.get(Request[0]) || null;
  } else {
    let ToReturn = [];
    Request.forEach(function(Name){
      ToReturn.push(this.Database.get(Name) || null);
    }.bind(this));
    Message.Result = ToReturn;
  }
  Child.Finished(Message);
};

Main.ActionINCR = function(Child, Request, Message){
  if(Request.length === 1){
    let Value = this.Database.get(Request[0]) || 0;
    if(typeof Value !== 'number'){
      throw new Error("Can't INCR Non-Numeric key ${Request[0]}");
    }
    this.Database.set(Request[0], ++Value);
    Message.Result = Value;
  } else {
    let ToReturn = [];
    Request.forEach(function(Name){
      let Value = this.Database.get(Name) || 0;
      if(typeof Value !== 'number'){
        throw new Error("Can't INCR Non-Numeric key ${Name}");
      }
      this.Database.set(Request[0], ++Value);
      ToReturn.push(Value);
    }.bind(this));
    Message.Result = ToReturn;
  }
  Child.Finished(Message);
};