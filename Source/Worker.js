

"use strict";
var
  CPP = new (require('childprocess-promise')),
  RedisProto = require('redis-proto'),
  SupportedEvents = null;

class Worker{
  constructor(Socket){
    this.Socket = Socket;
    this.Levels = 0;
    Socket.on('data', Worker.OnData.bind(this));
  }
  static OnData(Buffer){
    Buffer = Buffer.toString();
    let Result = RedisProto.Decode(Buffer);
    if(!Result.length || SupportedEvents.indexOf(Result[0]) === -1){
      this.Socket.write("-ERR unknown command '${Result[0] || ''}'\r\n");
    } else {
      CPP.Request(Result.shift(), Result).then(function(Response){
        if(!(Response instanceof Array) && Response !== null && typeof Response === 'object'){
          if(Response.Type === 'Error') {
            Response = '-' + Response.Message;
          } else if(Response.Type === 'OK'){
            Response = '+OK';
          } else {
            Response = '';
          }
        } else {
          Response = RedisProto.Encode(Response);
        }
        if(Response === ''){
          Response = '$0\r\n';
        }
        this.Socket.write(Response + "\r\n");
      }.bind(this));
    }
  }
}

process.on('message', function(C, Instance){
  if(C !== 'Server') return ;
  Instance.on('connection', function (Socket){
    new Worker(Socket);
  });
});
CPP.once('SupportedEvents', function(Events){
  SupportedEvents = Events;
});