var logger = require("../");
var path = require("path");
var options = {
  log4jsConfig: path.join(__dirname, "../logConfig.json"),
  apiLog: {
    uri: "http://10.16.75.24:3000/framework/v1/log-entry",
    global: "testGlobal",
    local: "testLocal",
    category: "exception",
    user: "jy25"
  }
}

logger.configure(options);

logger.debug("test from debug without category");
logger.info("test from info without category");
logger.trace("test from trace without category");
logger.warn("test from warn without category");
logger.error("test from error without category");

logger.debug("test from debug with category 'info'", "info");
logger.info("test from info with category 'info'", "info");
logger.trace("test from trace with category 'info'", "info");
logger.warn("test from warn with category 'info'", "info");
logger.error("test from error with category 'info'", "info");

logger.debug("test from debug with category 'error' and mail", "error", true);
logger.info("test from info with category 'error' and mail", "error", true);
logger.trace("test from trace with category 'error' and mail", "error", true);
logger.warn("test from warn with category 'error' and mail", "error", true);
logger.error("test from error with category 'error' and mail", "error", true);