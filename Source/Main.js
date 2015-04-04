

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
    var NumCPUs = OS.cpus().length;
    for(var i = 0; i < NumCPUs; ++i){
      let Child = new CPP(__dirname + '/../Main.js');
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