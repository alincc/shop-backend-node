'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var load = function load(req, res, next, id) {
  _Category2.default.get(id).then(function (category) {
    req.category = category;
    return next();
  }).catch(function (e) {
    return next(e);
  });
};

var create = function create(req, res, next) {
  var category = new _Category2.default({
    name: req.body.name,
    image: req.body.image
  });

  category.save().then(function (category) {
    return res.json({ message: 'Category created!', data: category });
  }).catch(function (e) {
    return next(e);
  });
};

var list = function list(req, res, next) {
  _Category2.default.list().then(function (category) {
    return res.json(category);
  }).catch(function (e) {
    return next(e);
  });
};

var get = function get(req, res) {
  return res.json(req.category);
};

var remove = function remove(req, res, next) {
  var category = req.category;

  category.remove().then(function () {
    return res.json({ message: 'Successfully deleted!' });
  }).catch(function (e) {
    return next(e);
  });
};

var update = function update(req, res, next) {
  var body = req.body || {};

  _Category2.default.findByIdAndUpdate(req.params.id, body, { new: true }).exec().then(function (category) {
    return res.json({ message: 'Category updated!', data: category });
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