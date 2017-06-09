'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _db = require('./app/config/db');

var _db2 = _interopRequireDefault(_db);

var _route = require('./app/routes/route');

var _route2 = _interopRequireDefault(_route);

var _User = require('./app/models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var port = process.env.PORT || 9000;

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

app.use((0, _cors2.default)());

app.use('/api', _route2.default);

app.listen(port);
console.log('Server listening on port ' + port);