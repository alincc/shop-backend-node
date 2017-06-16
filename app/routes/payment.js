import express from 'express';

import {
  paymentCtrl
} from '../controllers';
import {
  isValid
} from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({
      data: null,
      message: 'The payment was not found',
      status: 404
    });
  }

  return next();
});

router.route('/')
  .get(paymentCtrl.list)

  .post(paymentCtrl.create);

router.route('/:id')
  .get(paymentCtrl.get)

  .put(paymentCtrl.update)

  .delete(paymentCtrl.remove);

router.param('id', paymentCtrl.load);

export default router;
