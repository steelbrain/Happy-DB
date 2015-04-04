

"use strict";
var
  Main = module.parent.exports,
  Map = require('a-map');

Main.ActionHSET = function(Request){
  if(Request.length < 3){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  Main.ValidateArguments(Main.ARGS_ODD, Request.length);
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  try {
    Main.Validate(Main.VAL_HASH, 'HSET', Value);
  } catch(err){
    Value = new Map();
    this.Database.set(Key, Value);
  }
  for(let Number = 0; Number < Request.length; Number += 2){
    let HValue = Main.NormalizeType(Request[Number + 1]);
    Value.set(Request[Number], HValue);
  }
  return {Type: 'OK'};
};

Main.ActionHGET = function(Request){
  let Key = Request.shift();
  let Value = this.Database.get(Key);

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HGET', Value);

  if(Request.length === 1){
    return Value && Value.get(Request[0]) || '';
  } else {
    return Request.map(function(Key){
      return Value && Value.get(Key) || '';
    });
  }
};

Main.ActionHDEL = function(Request){
  if(Request.length < 2){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  let Length = 0;
  let Key = Request.shift();
  let Value = this.Database.get(Key);

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HDEL', Value);
  else
    return Length;

  Request.forEach(function(Name){
    Value.delete(Name);
    Length ++;
  }.bind(this));
  return Length;
};

Main.ActionHEXPIRE = function(Request){
  Main.ValidateArguments(Main.ARGS_ODD, Request.length);
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  let ToReturn = {Type: 'OK'};

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HEXPIRE', Value);

  for(let Number = 0; Number < Request.length; Number += 2){
    let HKey = Request[Number];
    let HTimeout = Main.NormalizeType(Request[Number + 1]);
    if(typeof HTimeout !== 'number')
      throw new Error("EXPIRE Expects even parameters to be numeric");
    let TimeoutKey = Symbol.for(Key + "\n" + HKey);
    clearTimeout(this.Timeouts[TimeoutKey]);
    this.Timeouts[TimeoutKey] = setTimeout(function(HKey){
      Main.ActionHDEL.call(this, [Key, HKey]);
    }.bind(this, HKey), HTimeout * 1000);
  }

  return ToReturn;
};

Main.ActionHEXISTS = function(Request){
  if(Request.length < 2){
    throw new Error(Main.MSG_ARGS_LESS);
  }

  let Key = Request.shift();
  let Value = this.Database.get(Key);

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HEXISTS', Value);

  if(Request.length === 1){
    return (Value && Value.has(Request[0])) === true ? 1 : 0;
  } else {
    return Request.map(function(HKey){
      return (Value && Value.has(HKey)) === true ? 1 : 0;
    });
  }
};

Main.ActionHGETALL = function(Request){
  Main.ValidateArguments(1, Request.length);

  let Value = this.Database.get(Request[0]);
  let ToReturn = [];

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HEXISTS', Value);
  else
    return ToReturn;
  Value.forEach(function(Value, Key){
    ToReturn.push(Key);
    ToReturn.push(Value);
  });
  return ToReturn;
};

Main.ActionHKEYS = function(Request){
  Main.ValidateArguments(1, Request.length);

  let Value = this.Database.get(Request[0]);
  let ToReturn = [];

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HEXISTS', Value);
  else
    return ToReturn;
  let Iterator = Value.keys();
  let IteratorVal = null;
  while(!(IteratorVal = Iterator.next()).done){
    ToReturn.push(IteratorVal.value);
  }
  return ToReturn;
};

Main.ActionHLEN = function(Request){
  Main.ValidateArguments(1, Request.length);

  let Value = this.Database.get(Request[0]);

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HEXISTS', Value);
  else
    return 0;
  return Value.size
};

Main.ActionHVALS = function(Request){
  Main.ValidateArguments(1, Request.length);

  let Value = this.Database.get(Request[0]);
  let ToReturn = [];

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HEXISTS', Value);
  else
    return ToReturn;
  let Iterator = Value.values();
  let IteratorVal = null;
  while(!(IteratorVal = Iterator.next()).done){
    ToReturn.push(IteratorVal.value);
  }
  return ToReturn;
};

Main.ActionHMGET = Main.ActionHGET;
Main.ActionHMSET = Main.ActionHSET;

// Custom Functions
/**
 * I personally needed the features below to get this kind-of behaviour
 * =======================
 * QP:USERS {
 *  USER:1 {
 *   NAME: "Steel"
 *   USERNAME: "SteelBrain"
 *  }
 * }
 */

/**
 * HHSET KEY HKEY HHKEY HHVALUE HHKEY2 HHVALUE2
 */
Main.ActionHHSET = function(Request){
  Main.ValidateArguments(Main.ARGS_EVEN, Request.length);
  if(Request.length < 4){
    throw new Error(Main.MSG_ARGS_LESS);
  }
  let Key = Request.shift();
  let Value = this.Database.get(Key);
  try {
    Main.Validate(Main.VAL_HASH, 'HHSET', Value);
  } catch(err){
    Value = new Map();
    this.Database.set(Key, Value);
  }
  let HKey = Request.shift();
  let HValue = Value.get(HKey);
  try {
    Main.Validate(Main.VAL_HASH, 'HHSET', HValue);
  } catch(err){
    HValue = new Map();
    Value.set(HKey, HValue);
  }
  for(let Number = 0; Number < Request.length; Number += 2){
    HValue.set(Request[Number], Main.NormalizeType(Request[Number + 1]));
  }
  return {Type: 'OK'};
};

/**
 * HHGET KEY HKEY HHKEY1 HHKEY2
 */
Main.ActionHHGET = function(Request){
  let Key = Request.shift();
  let Value = this.Database.get(Key);

  let DefaultValue = Request.length === 2 ? '' : [];

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HHGET', Value);
  else return DefaultValue;

  let HKey = Request.shift();
  let HValue = Value.get(HKey);

  Main.Validate(Main.VAL_HASH, 'HHGET', HValue);
  if(Request.length === 1){
    return HValue.get(Request[0]) || '';
  } else {
    return Request.map((Name) => HValue.get(Name) || '')
  }
};

/**
 * HHDEL KEY HKEY HHKEY1 HHKEY2
 */
Main.ActionHHDEL = function(Request){
  let Key = Request.shift();
  let Value = this.Database.get(Key);

  let ToReturn = 0;

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HHDEL', Value);
  else return ToReturn;

  let HKey = Request.shift();
  let HValue = Value.get(HKey);

  Main.Validate(Main.VAL_HASH, 'HHDEL', HValue);
  Request.forEach((Name) => HValue.delete(Name) && ++ToReturn);
  return ToReturn
};

/**
 * HHGETALL KEY HKEY
 */
Main.ActionHHGETALL = function(Request){
  Main.ValidateArguments(2, Request.length);

  let Key = Request.shift();
  let Value = this.Database.get(Key);

  let ToReturn = [];

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HGETALL', Value);
  else return ToReturn;

  let HKey = Request.shift();
  let HValue = Value.get(HKey);

  Main.Validate(Main.VAL_HASH, 'HGETALL', HValue);
  HValue.forEach(function(Value, Key){
    ToReturn.push(Key);
    ToReturn.push(Value);
  });
  return ToReturn;
};


/**
 * HHEXISTS KEY HKEY HHKEY HHKEY2...
 */
Main.ActionHHEXISTS = function(Request){
  if(Request.length < 3){
    throw new Error(Main.MSG_ARGS_LESS);
  }

  let Key = Request.shift();
  let Value = this.Database.get(Key);

  let ToReturn = Request.length === 2 ? '' : [];

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HHEXISTS', Value);
  else return ToReturn;

  let HKey = Request.shift();
  let HValue = Value.get(HKey);

  Main.Validate(Main.VAL_HASH, 'HHEXISTS', HValue);

  if(Request.length === 1){
    return HValue.has(Request[0]) ? 1 : 0;
  } else {
    return Request.map((Name) => HValue.has(Name) ? 1 : 0);
  }
};

/**
 * HHEXPIRE KEY HKEY HHKEY1 HHKEY1Timeout HHKEY2 HHKEY2Timeout...
 */
Main.ActionHHEXPIRE = function(Request){
  Main.ValidateArguments(Main.ARGS_EVEN, Request.length);

  let Key = Request.shift();
  let Value = this.Database.get(Key);

  let ToReturn = {Type: "OK"};

  if(typeof Value !== 'undefined')
    Main.Validate(Main.VAL_HASH, 'HHEXISTS', Value);
  else return ToReturn;

  let HKey = Request.shift();
  let HValue = Value.get(HKey);

  Main.Validate(Main.VAL_HASH, 'HHEXISTS', HValue);

  for(let Number = 0; Number < Request.length; Number += 2){
    let HHKey = Request[Number];
    let HHTimeout = Main.NormalizeType(Request[Number + 1]);
    if(typeof HHTimeout !== 'number')
      throw new Error("EXPIRE Expects even parameters to be numeric");
    let TimeoutKey = Symbol.for(Key + "\n" + HKey + "\n" + HHKey);
    clearTimeout(this.Timeouts[TimeoutKey]);
    this.Timeouts[TimeoutKey] = setTimeout(function(HKey, HHKey){
      Main.ActionHHDEL.call(this, [Key, HKey, HHKey]);
    }.bind(this, HKey, HHKey), HHTimeout * 1000);
  }

  return ToReturn;
};