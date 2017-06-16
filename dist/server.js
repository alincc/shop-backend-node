'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _config = require('./app/config/config');

var _config2 = _interopRequireDefault(_config);

var _db = require('./app/config/db');

var _db2 = _interopRequireDefault(_db);

var _route = require('./app/routes/route');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)(); // eslint-disable-line no-unused-vars


var port = process.env.PORT || 9000;

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use((0, _cors2.default)());

app.use('/api', _route2.default);

app.use(function (err, req, res, next) {
  return (// eslint-disable-line no-unused-vars
    res.status(err.status).json({
      message: err.isPublic ? err.message : _httpStatus2.default[err.status],
      stack: _config2.default.env === 'development' ? err.stack : {}
    })
  );
});

app.listen(port);
console.log('Server listening on port ' + port); // eslint-disable-line no-console