import express from 'express';

import {
  productCtrl
} from '../controllers';
import {
  isValid
} from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({
      data: null,
      message: 'The product was not found',
      status: 404
    });
  }

  return next();
});

router.route('/')
  .get(productCtrl.list)

  .post(productCtrl.create);

router.route('/:id/restore')
  .get(productCtrl.restore);

router.route('/:id')
  .get(productCtrl.get)

  .put(productCtrl.update)

  .delete(productCtrl.remove);

router.param('id', productCtrl.load);

export default router;
