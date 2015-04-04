

"use strict";
var
  OS = require('os'),
  Net = require('net'),
  CPP = require('childprocess-promise');
class Main{
  constructor(Port){
    this.Port = Number(Port);
    this.Server = null;
    this.Children = [];
    this.Database = new Map();
  }
  Run(){
    let NumCPUs = OS.cpus().length;
    let SupportedEvents = [];

    for(let Name in Main){
      if (typeof Main[Name] === 'function' && Name.substr(0, 6) === 'Action')
        SupportedEvents.push(Name.substr(6));
    }
    for(var i = 0; i < NumCPUs; ++i){
      let Child = new CPP(__dirname + '/../Main.js');
      SupportedEvents.forEach(function(Child, Event){
        Child.on(Event, function(Request, Message){
          try {
            Main['Action' + Event].call(this, Child, Request, Message);
          } catch(error){
            console.log(error.stack);
            Message.Result = {Type: 'Error', Message: error.message};
            Child.Finished(Message);
          }
        }.bind(this));
      }.bind(this, Child));
      Child.Send('SupportedEvents', SupportedEvents);
      this.Children.push(Child);
    }
    let Server = this.Server = Net.createServer();
    this.Server.listen(this.Port, this.Children.forEach.bind(this.Children, function(Child){
      Child.Target.send('Server', Server);
    }));
  }
  static ActionSET(Child, Request, Message){
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
  }
  static ActionGET(Child, Request, Message){
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
  }
  static ActionINCR(Child, Request, Message){
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
  }
}
module.exports = Main;