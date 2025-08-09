const { CookieJar } = require('tough-cookie');
const makeFetchCookie = require('fetch-cookie');
const Constants = require('../../util/Constants')

const cookieJar = new CookieJar();
const fetchWithCookies = makeFetchCookie(globalThis.fetch, cookieJar);

class APIRequest {
  constructor(rest, method, path, auth, data, files, reason, contextmenu) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.path = path.toString();
    this.auth = auth;
    this.data = data;
    this.files = files;
    this.route = this.getRoute(this.path);
    this.reason = reason;
    this.contextmenu = contextmenu;
  }

  getRoute(url) {
    const route = url.split('?')[0].split('/');
    const routeBucket = [];
    for (let i = 0; i < route.length; i++) {
      if (route[i - 1] === 'reactions') break;
      if (/\d{16,19}/g.test(route[i]) && !/channels|guilds/.test(route[i - 1])) routeBucket.push(':id');
      else routeBucket.push(route[i]);
    }
    return routeBucket.join('/');
  }

  getAuth() {
    if (this.client.token && this.client.user && this.client.user.bot) {
      return `Bot ${this.client.token}`;
    } else if (this.client.token) {
      return this.client.token;
    }
    throw new Error(Constants.Errors.NO_TOKEN);
  }

  getProxyConfig() {
    if (typeof this.client.options.proxy === 'string' && this.client.options.proxy.length > 0) {
      const proxyUrl = this.client.options.proxy;

      let fullProxyUrl = proxyUrl;
      if (!proxyUrl.startsWith('http://') && !proxyUrl.startsWith('https://') && !proxyUrl.startsWith('socks')) {
        fullProxyUrl = `http://${proxyUrl}`
      }

      if (this.client.options.debug) console.log(`Initializing proxy with: ${fullProxyUrl}`);

      return fullProxyUrl;
    }
    return null;
  }

  configureTLSForFetch(options) {

    options.tls = {
      ciphers: Constants.ciphers.join(':'),
      rejectUnauthorized: false, 
      secureProtocol: 'TLSv1_2_method'
    };

    return options;
  }

  gen(captchaKey = undefined, captchaRqtoken = undefined) {
    const API = `${this.client.options.http.host}/api/v${this.client.options.http.version}`;

    const proxyUrl = this.getProxyConfig();

    const headers = {
      'authority': 'discord.com',
      'accept': '*/*',
      'accept-language': 'en-US',
      'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'X-Debug-Options': 'bugReporterEnabled',
      'X-Discord-Locale': 'en-US',
      'X-Discord-Timezone': 'Europe/Paris'
    };

    if (this.reason) headers['X-Audit-Log-Reason'] = encodeURIComponent(this.reason);
    if (this.contextmenu) headers['X-Context-Properties'] = this.contextmenu;
    if (this.auth) headers['Authorization'] = this.getAuth();
    if (this.client.cookie) headers['Cookie'] = this.client.cookie;
    if (!this.rest.client.browser) headers['User-Agent'] = this.rest.userAgentManager.userAgent;

    const superPropertiesSource = this.client.options.ws.properties.browser === "Discord Embedded" ?
      Constants.DefaultOptions.ws.properties : this.client.options.ws.properties;

    headers['X-Super-Properties'] = Buffer.from(
      this.client.options.jsonTransformer(superPropertiesSource),
      'ascii'
    ).toString('base64');

    if (captchaKey && typeof captchaKey === 'string') {
      headers['X-Captcha-Key'] = captchaKey;
      if (captchaRqtoken) headers['X-Captcha-Rqtoken'] = captchaRqtoken;
    }

    if (this.client.fingerprint) headers['fingerprint'] = this.client.fingerprint;

    const options = {
      method: this.method.toUpperCase(),
      headers,
      timeout: 15000, 
      redirect: 'follow',
      credentials: 'include'
    };

    this.configureTLSForFetch(options);

    if (proxyUrl) {
      options.proxy = proxyUrl;
      if (this.client.options.debug) console.log(`Using proxy for request to ${API}${this.path}`);
    } else {
      if (this.client.options.debug) console.log(`No proxy used for request to ${API}${this.path}`);
    }

    if (this.files) {
      const formData = new FormData();

      for (const file of this.files) {
        if (file && file.file) {
          const blob = file.file instanceof Buffer ?
            new Blob([file.file]) :
            new Blob([file.file], { type: 'application/octet-stream' });

          formData.append(file.name, blob, file.name);
        }
      }

      if (typeof this.data !== 'undefined') {
        formData.append('payload_json', JSON.stringify(this.data));
      }

      options.body = formData;
    } else if (this.data) {
      options.body = JSON.stringify(this.data);
      options.headers['Content-Type'] = 'application/json';
    }

    const fetchWrapper = fetchWithCookies(`${API}${this.path}`, options);

    fetchWrapper.end = function (callback) {
      this.then(async response => {
        const responseObj = {
          statusCode: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          ok: response.ok
        };

        const buffer = await response.arrayBuffer();
        const rawBuffer = Buffer.from(buffer);
        responseObj.rawBuffer = rawBuffer;

        try {
          const textContent = rawBuffer.toString();
          responseObj.text = textContent;
          responseObj.body = JSON.parse(textContent);
        } catch (e) {
          responseObj.body = rawBuffer;
          responseObj.text = rawBuffer.toString();
        }

        if (!response.ok) {
          const err = new Error(`${response.status} ${response.statusText}`);
          err.response = responseObj;
          callback(err.text);
        } else {
          callback(null, responseObj);
        }
      }).catch(err => callback(err));

      return this;
    };

    return fetchWrapper;
  }
}

module.exports = APIRequest;