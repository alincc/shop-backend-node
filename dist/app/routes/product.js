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
    return res.status(404).send({
      data: null,
      message: 'The product was not found',
      status: 404
    });
  }

  return next();
});

router.route('/').get(_controllers.productCtrl.list).post(_controllers.productCtrl.create);

router.route('/:id').get(_controllers.productCtrl.get).put(_controllers.productCtrl.update).delete(_controllers.productCtrl.remove);

router.param('id', _controllers.productCtrl.load);

exports.default = router;