'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllers = require('../controllers');

var _idValidator = require('../common/id-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/:id', function (req, res, next) {
  if (!(0, _idValidator.isValid)(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The customer was not found', status: 404 });
  }

  return next();
});

router.route('/').get(_controllers.customerCtrl.list).post(_controllers.customerCtrl.create);

router.route('/:id').get(_controllers.customerCtrl.get).put(_controllers.customerCtrl.update).delete(_controllers.customerCtrl.remove);

router.param('id', _controllers.customerCtrl.load);

exports.default = router;