'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The user was not found', status: 404 });
  }

  next();
});

router.route('/').get(function (req, res) {
  _User2.default.find(function (err, users) {
    if (err) return res.send(err);

    res.json(users);
  });
}).post(function (req, res) {
  var user = new _User2.default();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;

  user.save(function (err) {
    if (err) return res.send(err);

    res.json({ message: 'User created!' });
  });
});

router.route('/:id').get(function (req, res) {

  _User2.default.findById(req.params.id).populate('customer').exec(function (err, user) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send({ data: null, message: 'The user was not found', status: 404 });

    res.json(user);
  });
}).put(function (req, res) {
  _User2.default.findById(req.params.id, function (err, user) {
    if (err) return res.send(err);

    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.customer = req.body.customer;

    user.save(function (err) {
      if (err) return res.send(err);

      res.json({ message: 'User updated!' });
    });
  });
}).delete(function (req, res) {
  _User2.default.remove({
    _id: req.params.id
  }, function (err, user) {
    if (err) return res.send(err);

    res.json({ message: 'Successfully deleted!' });
  });
});

exports.default = router;