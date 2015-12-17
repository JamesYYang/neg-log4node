var logger = require("../");

var options = {
  apiLog: {
    uri: "http://10.16.75.24:3000/framework/v1/log-entry",
    global: "testGlobal",
    local: "testLocal",
    category: "exception",
    user: "jy25"
  }
}

logger.configure(options);

logger.debug("test from debug without mail");
logger.log("test from log without mail");
logger.info("test from info without mail");
logger.trace("test from trace without mail");
logger.warn("test from warn without mail");
logger.error("test from error without mail");

//logger.debug("test from debug with mail", true);
//logger.info("test from info with mail", true);
//logger.trace("test from trace with mail", true);
//logger.warn("test from warn with mail", true);
//logger.error("test from error with mail", true);

logger.error(options);