'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Category = require('../models/Category');

var _Category2 = _interopRequireDefault(_Category);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The category was not found', status: 404 });
  }

  next();
});

router.route('/').get(function (req, res) {
  _Category2.default.find(function (err, categories) {
    if (err) return res.send(err);

    res.json(categories);
  });
}).post(function (req, res) {
  var category = new _Category2.default();
  category.name = req.body.name;
  category.image = req.body.image;

  category.save(function (err) {
    if (err) return res.send(err);

    res.json({ message: 'Category created!' });
  });
});

router.route('/:id').get(function (req, res) {
  _Category2.default.findById(req.params.id).populate('products').exec(function (err, category) {
    if (err) return res.status(500).send(err);
    if (!category) return res.status(404).send({ data: null, message: 'The category was not found', status: 404 });

    res.json(category);
  });
}).put(function (req, res) {
  var body = req.body || {};

  _Category2.default.findByIdAndUpdate(req.params.id, body, { new: true }).populate('products').exec(function (err, category) {
    if (err) return res.send(err);

    return res.json({ message: 'Category updated!', data: category });
  });
}).delete(function (req, res) {
  _Category2.default.remove({
    _id: req.params.id
  }, function (err, category) {
    if (err) return res.send(err);

    res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;