module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  backend: {
    hapiRemote: true,
    hapiLocal: false,
    parseRemote: false,
    parseLocal: false
  },
  HAPI: {
    local: {
      url: 'http://192.168.0.13:5000'
    },
    remote: {
      url: 'https://snowflakeserver-bartonhammond.rhcloud.com/'
    }
  },
  PARSE: {
    appId: 'snowflake',                              // match APP_ID in parse-server's index.js
    masterKey: 'F6NmZRK2VBncbdJCJRvPPJWyMLTjzPeWeX', // match MASTER_KEY in parse-server's index.js
    local: {
      url: 'http://localhost:1337/parse'             // match SERVER_URL in parse-server's index.js
    },
    remote: {
      url: 'https://enter_your_snowflake_host.com'   // match SERVER_URL in parse-server's index.js
    }
  }
}
