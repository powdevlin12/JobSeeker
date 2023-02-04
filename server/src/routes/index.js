module.exports = api => api
  .use('/auth', require('./authentication.router'))