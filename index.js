var log4js = require("log4js");
var request = require("request");
var os = require("os");
var path = require("path");
var apiLogConfig;

exports.configure = function(options){
  var path = options.log4jsConfig || path.join(__dirname, "log4js_Config.json");
  var cwd = options.log4jsCWD || __dirname;
  log4js.configure(path, {reloadSecs: 50, cwd: cwd});
  if (options.apiLog){
    if(!options.apiLog.uri){
      throw new Error("Log API URI is required.");
    }
    apiLogConfig = {
      uri: options.apiLog.uri,
      global: options.apiLog.global || "auto",
      local: options.apiLog.local || "auto",
      category: options.apiLog.category || "auto",
      userName: options.apiLog.user || "system"
    };

  }
};

exports.info = function(args, category, isApi){
  var options = parseArgs(arguments);
  options.logger.info(options.content);
  if(options.isApi){
    writeApiLog(options.content);
  }
};

exports.debug = function(args, category, isApi){
  var options = parseArgs(arguments);
  options.logger.debug(options.content);
  if(options.isApi){
    writeApiLog(options.content);
  }
};

exports.trace = function(args, category, isApi){
  var options = parseArgs(arguments);
  options.logger.trace(options.content);
  if(options.isApi){
    writeApiLog(options.content);
  }
};

exports.warn = function(args, category, isApi){
  var options = parseArgs(arguments);
  options.logger.warn(options.content);
  if(options.isApi){
    writeApiLog(options.content);
  }
};

exports.error = function(args, category, isApi){
  var options = parseArgs(arguments);
  options.logger.error(options.content);
  if(options.isApi){
    writeApiLog(options.content);
  }
};

writeApiLog = exports.apiError = function(error) {
  var logEntry, options;
  options = getLogApiOption();
  logEntry = {
    CategoryName: apiLogConfig.category,
    GlobalName: apiLogConfig.global,
    LocalName: apiLogConfig.local,
    LogType: "E",
    LogServerIP: getLocalIP(),
    LogUserName: apiLogConfig.userName,
    Content: stringify(error)
  };
  options.body = JSON.stringify(logEntry);
  return request(options, function(err, response, body) {
    if ((err != null) || response.statusCode >= 400) {
      console.error("Write API Log failed");
      console.error(err);
      console.error(body);
    }
  });
};

parseArgs = function(args){
  var a = Array.prototype.slice.call(args);
  if(a.length === 0){
    throw new Error("Log content is required.")
  }
  else{
    var options = {};
    options.content = a[0];
    if(a.length === 2 && is("Boolean", a[1])){
      options.logger = log4js.getLogger();
      options.isApi = a[1];
    }
    else{
      options.logger = log4js.getLogger(a[1]);
      options.isApi = a[2];
    }
    return options;
  }
};

is = function(type, obj){
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj != undefined && obj != null && clas === type;
};

getLogApiOption = function(){
  if(!apiLogConfig){
    throw new Error("Please provider log API url");
  }
  var options = {
    method: "POST",
    url: apiLogConfig.uri,
    headers: {
      "accept": "application/json",
      "content-type": "application/json"
    }
  }
  return options;
};

getLocalIP = function() {
  var interfaces, k, k2, temp;
  interfaces = os.networkInterfaces();
  for (k in interfaces) {
    for (k2 in interfaces[k]) {
      temp = interfaces[k][k2];
      if (temp.family === "IPv4" && !temp.internal) {
        return temp.address;
      }
    }
  }
};

stringify = function(val) {
  var stack, str;
  stack = val.stack;
  if (stack) {
    return String(stack);
  }
  str = String(val);
  if (str === toString.call(val)) {
    return inspect(val);
  } else {
    return str;
  }
};
