const UserAgentManager = require('./UserAgentManager');
const RESTMethods = require('./RESTMethods');
const SequentialRequestHandler = require('./RequestHandlers/Sequential');
const BurstRequestHandler = require('./RequestHandlers/Burst');
const APIRequest = require('./APIRequest');
const CaptchaSolver = require('./CaptchaSolver');
const Constants = require('../../util/Constants');

class RESTManager {
  constructor(client) {
    this.client = client;
    this.handlers = {};
    this.userAgentManager = new UserAgentManager(this);
    this.methods = new RESTMethods(this);
    this.rateLimitedEndpoints = {};
    this.globallyRateLimited = false;
    this.captchaService = null;
    this.setup();
  }

  setup() {
    if (this.client.options.ws.properties.browser_user_agent) {
      this.userAgentManager.set(this.client.options.ws.properties.browser_user_agent)
    }
    this.captchaService = new CaptchaSolver(
      this.client.options.captchaService,
      this.client.options.captchaKey,
      this.client.options.captchaSolver,
      this.client.options.captchaWithProxy ? this.client.options.proxy : '',
    );
  }

  destroy() {
    for (const handlerKey of Object.keys(this.handlers)) {
      const handler = this.handlers[handlerKey];
      if (handler.destroy) handler.destroy();
    }
  }

  push(handler, apiRequest) {
    return new Promise((resolve, reject) => {
      handler.push({
        request: apiRequest,
        resolve,
        reject,
        retries: 0,
      });
    });
  }

  getRequestHandler() {
    switch (this.client.options.apiRequestMethod) {
      case 'sequential':
        return SequentialRequestHandler;
      case 'burst':
        return BurstRequestHandler;
      default:
        throw new Error(Constants.Errors.INVALID_RATE_LIMIT_METHOD);
    }
  }

  makeRequest(method, url, auth, data, file, reason, contextmenu) {
    const apiRequest = new APIRequest(this, method, url, auth, data, file, reason, contextmenu);
    if (!this.handlers[apiRequest.route]) {
      const RequestHandlerType = this.getRequestHandler();
      this.handlers[apiRequest.route] = new RequestHandlerType(this, apiRequest.route);
    }

    return this.push(this.handlers[apiRequest.route], apiRequest);
  }
}

module.exports = RESTManager;
