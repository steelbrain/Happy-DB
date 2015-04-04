#!/usr/bin/env iojs


var
  Main = require('./Main');
if(process.argv.length !== 3 || isNaN(parseInt(process.argv[2]))){
  console.error("You must provide a port to use");
  process.exit(1);
}
try {
  (new Main(process.argv[2])).Run();
} catch(err){
  console.log(err);
  process.exit(1);
}