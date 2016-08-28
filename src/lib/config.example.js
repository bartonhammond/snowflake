module.exports = {
  PARSE: {
    APP_ID: '',
    REST_API_KEY: '',
    SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY'
  },
  backend: {
    parse: false,
    hapiRemote: false,
    hapiLocal: true
  },
  HAPI: {
    local: {
      url: 'http://127.0.0.1:5000'
    },
    remote: {
      url: 'enter your remote url here'
    }
  }
}
