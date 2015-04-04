

// @Compiler-Transpile "true"
// @Compiler-Output "../Dist/Main.js"
"use strict";
var
  OS = require('os'),
  Net = require('net'),
  CPP = require('childprocess-promise'),
  DebugErrors = require('debug')('happy-db:errors'),
  Debug = require('debug')('happy-db:calls'),
  Map = require('a-map'),
  FS = require('fs');
class Main{
  constructor(Port, DBPath){
    this.Port = Number(Port);
    this.DBPath = DBPath;
    this.Server = null;
    this.Children = [];
    this.Channels = new Map();
    try {
      this.Database = Main.Parse(JSON.parse(FS.readFileSync(DBPath).toString()));
    } catch(error){
      this.Database = new Map();
    }
    process.on('SIGTERM', Main.Close.bind(this));
    process.on('SIGINT', Main.Close.bind(this));
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
            Debug(Event);
            Message.Result = Main['Action' + Event].call(this, Request, Child, Message);
          } catch(error){
            DebugErrors(error.stack);
            Message.Result = {Type: 'Error', Message: error.message};
          }
          Child.Finished(Message);
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

  static NormalizeType(Value){
    let ValueInt = parseInt(Value);
    if(!isNaN(ValueInt) && ValueInt.toString() === Value){
      return ValueInt;
    }
    return Value;
  }
  static Validate(Type, Action, Value){
    if(Type === Main.VAL_NUMERIC){
      if(typeof Value !== 'number')
        throw new Error(`Cant ${Action} Non-Numeric Item`);
    } else if(Type === Main.VAL_STRINGISH){
      if(typeof Value !== 'string' && typeof Value !== 'number')
        throw new Error(`Cant ${Action} Non-Stringish Item`);
    } else if(Type === Main.VAL_HASH){
      if(typeof Value !== 'object' || !Value.constructor || !Value.constructor.name === 'Map')
        throw new Error(`Cant ${Action} Non-Hash Item`);
    } else if(Type === Main.VAL_LIST){
      if(typeof Value !== 'object' || !Value.constructor || !Value.constructor.name === 'Array')
        throw new Error(`Cant ${Action} Non-List Item`);
    }
    return Value;
  }
  static ValidateArguments(TypeOrLength, Length){
    if(typeof TypeOrLength === 'string'){
      let IsOdd = Length % 2;
      if(TypeOrLength === Main.ARGS_EVEN && IsOdd)
        throw new Error(Main.MSG_ARGS_INVALID + '; Expected Even');
      else if(TypeOrLength === Main.ARGS_ODD && !IsOdd){
        throw new Error(Main.MSG_ARGS_INVALID + '; Expected Odd');
      }
    } else{
      if(TypeOrLength > Length){
        throw new Error(Main.MSG_ARGS_MORE);
      } else if(TypeOrLength < Length){
        throw new Error(Main.MSG_ARGS_LESS);
      }
    }
  }
  static Parse(Contents){
    if(typeof Contents === 'object' && Contents !== null && !(Contents instanceof Array)){
      let ToReturn = new Map();
      for(let Key in Contents){
        if(Contents.hasOwnProperty(Key)){
          ToReturn.set(Key, Main.Parse(Contents[Key]));
        }
      }
      return ToReturn;
    } else {
      return Contents;
    }
  }
  static stringify(Map){
    if(Map && Map.constructor && Map.constructor.name === 'Map'){
      let ToReturn = {};
      Map.forEach(function(Value, Key){
        ToReturn[Key] = Main.stringify(Value);
      });
      return ToReturn;
    } else {
      return Map;
    }
  }
  static Close(){
    FS.writeFileSync(this.DBPath, JSON.stringify(Main.stringify(this.Database)));
    process.exit();
  }
}

Main.VAL_NUMERIC = 'VAL_NUMERIC';
Main.VAL_STRINGISH = 'VAL_STRING';
Main.VAL_HASH = 'VAL_HASH';
Main.VAL_LIST = 'VAL_LIST';

Main.MSG_ARGS_MORE = 'Too Many Arguments';
Main.MSG_ARGS_LESS = 'Too less Arguments';
Main.MSG_ARGS_INVALID = 'Invalid Number of Arguments';

Main.ARGS_EVEN = 'EVEN';
Main.ARGS_ODD = 'ODD';

Main.prototype.Timeouts = {};

module.exports = Main;

// Load the functions
require('./Methods_Basic');
require('./Methods_Hash');
require('./Methods_List');