var t = require('./lib');
var i18n = require('./lib/i18n/en');
var templates = require('./lib/templates/bootstrap');
var stylesheet = require('./lib/stylesheets/bootstrap');

t.form.Form.templates = templates;
t.form.Form.stylesheet = stylesheet;
t.form.Form.i18n = i18n;

module.exports = t;