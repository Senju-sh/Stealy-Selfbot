const Constants = require('../../util/Constants');

class UserAgentManager {
  constructor() {
    this.defaultAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9154 Chrome/124.0.6367.243 Electron/30.1.0 Safari/537.36`
    this.build(this.defaultAgent);
  }

  set(agent) {
    this.build(agent);
  }

  build(agent) {
    this.userAgent = `${agent}`;
  }
}

UserAgentManager.DEFAULT = {
  url: Constants.Package.homepage.split('#')[0],
  version: Constants.Package.version,
};

module.exports = UserAgentManager;
