

var
  v8 = require('v8'),
  CPP = require('childprocess-promise');
v8.setFlagsFromString('--harmony_classes');
v8.setFlagsFromString('--harmony_object_literals');
v8.setFlagsFromString('--harmony_tostring');
v8.setFlagsFromString('--harmony_arrow_functions');
if(CPP.IsMaster){
  module.exports = require('./Source/Main');
} else {
  module.exports = require('./Source/Worker');
}