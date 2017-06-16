'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _User2.default.get(id).then(function (user) {
    req.user = user;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var user = new _User2.default({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.save().then(function (user) {
    return res.json({ message: 'User created!', data: user });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  _User2.default.list().then(function (user) {
    return res.json(user);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.user);
};

var remove = function remove(req, res, next) {
  var user = req.user;

  user.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _User2.default.findByIdAndUpdate(req.params.id, body, { new: true }).exec().then(function (user) {
    return res.json({ message: 'User updated!', data: user });
  }).catch(function (e) {
    return next(e);
  });
};

exports.default = {
  create: create,
  list: list,
  get: get,
  load: load,
  remove: remove,
  update: update
};