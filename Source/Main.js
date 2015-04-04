

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
  
  static Validate(Type, Action, Value){
    if(Type === Main.VAL_NUMERIC){
      if(typeof Value !== 'number')
        throw new Error("Cant ${Action} Non-Numeric Item");
    } else if(Type === Main.VAL_STRINGISH){
      if(typeof Value !== 'string' && typeof Value !== 'number')
        throw new Error("Cant ${Action} Non-Stringish Item");
    } else if(Type === Main.VAL_HASH){
      if(typeof Value !== 'object')
        throw new Error("Cant ${Action} Non-Hash Item");
    } else if(Type === Main.VAL_LIST){
      if(typeof Value !== 'object' || !Value.constructor || !Value.constructor.name === 'Array')
        throw new Error("Cant ${Action} Non-List Item");
    }
    return Value;
  }
}
Main.VAL_NUMERIC = 'VAL_NUMERIC';
Main.VAL_STRINGISH = 'VAL_STRING';
Main.VAL_HASH = 'VAL_HASH';
Main.VAL_LIST = 'VAL_LIST';
module.exports = Main;

// Load the functions
require('./Methods_Basic');