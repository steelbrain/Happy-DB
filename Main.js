

var
  IsIoJS = parseInt(process.version.substr(1)) > 0,
  CPP = require('childprocess-promise');
if(IsIoJS){
  var v8 = require('v8');
  v8.setFlagsFromString('--harmony_classes');
  v8.setFlagsFromString('--harmony_object_literals');
  v8.setFlagsFromString('--harmony_tostring');
  v8.setFlagsFromString('--harmony_arrow_functions');
  if(CPP.IsMaster){
    module.exports = require('./Source/Main');
  } else {
    module.exports = require('./Source/Worker');
  }
} else {
  if(CPP.IsMaster){
    module.exports = require('./Dist/Main');
  } else {
    module.exports = require('./Dist/Worker');
  }
}