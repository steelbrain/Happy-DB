

"use strict";
var
  OS = require('os'),
  Net = require('net'),
  CPP = require('childprocess-promise');
class Main{
  constructor(Port){
    this.Port = Port;
    this.Server = null;
    this.Children = [];
    this.DataBase = new Map();
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
      this.DataBase.set(Request[Number], Request[Number + 1]);
    }
    Message.Result = {Type: 'OK'};
    Child.Finished(Message);
  }
}
var Inst = new Main(9004, 4);
Inst.Run();