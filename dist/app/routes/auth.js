'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _Customer = require('../models/Customer');

var _Customer2 = _interopRequireDefault(_Customer);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var privateKey = _config2.default.key.privateKey;

function requireAuth(req, res, next) {
  var bearerToken = void 0;
  var bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    bearerToken = bearer[1];
    req.token = bearerToken;

    try {
      req.user = _jsonwebtoken2.default.verify(req.token, privateKey);
    } catch (err) {
      return res.sendStatus(403);
    }

    next();
  } else {
    return res.sendStatus(403);
  }
}

router.use('/userinfo', requireAuth);

router.route('/register').post(function (req, res) {
  var user = new _User2.default();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;

  user.save(function (err) {
    if (err) return res.send(err);

    res.json({ message: 'User created!', data: user });
  });
});

router.route('/').post(function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  _User2.default.findOne({ email: email, password: password }).populate({
    path: 'customer',
    model: 'Customer',
    populate: {
      path: 'orders',
      model: 'Order'
    }
  }).exec(function (err, user) {
    if (err) return res.send(err);

    if (!user) {
      return res.json(null);
    }
    var token = _jsonwebtoken2.default.sign({ _id: user._id, email: user.email }, privateKey);

    return res.json({ token: token });
  });
});

router.route('/userinfo').get(function (req, res) {
  _User2.default.findOne({ _id: req.user._id }).populate({
    path: 'customer',
    model: 'Customer',
    populate: {
      path: 'orders',
      model: 'Order'
    }
  }).exec(function (err, user) {
    if (err) return res.send(err);

    return res.json(user);
  });
}).put(function (req, res) {
  _User2.default.findOne({ _id: req.user._id }).exec().then(function (user) {
    user.customer = req.body.customer;
    return user.save();
  }).then(function (user) {
    return res.json(user);
  }).catch(function (err) {
    return res.status(500).send(err);
  });
});

exports.default = router;