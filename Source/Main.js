

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
      SupportedEvents.forEach(function(Event){
        Child.on(Event, Main['Action' + Event].bind(this, Child));
      }.bind(this));
      Child.Send('SupportedEvents', SupportedEvents);
      this.Children.push(Child);
    }
    let Server = this.Server = Net.createServer();
    this.Server.listen(this.Port, this.Children.forEach.bind(this.Children, function(Child){
      Child.Target.send('Server', Server);
    }));
  }
}
var Inst = new Main(9004, 4);
Inst.Run();