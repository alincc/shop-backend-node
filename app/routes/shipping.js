import express from 'express';
import { shippingCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.route('/')
  .get(shippingCtrl.list)

  .post(shippingCtrl.create);

router.route('/delete-many')
  .post(shippingCtrl.removeMany);

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The shipping was not found', status: 404 });
  }

  return next();
});

router.route('/:id')
  .get(shippingCtrl.get)

  .put(shippingCtrl.update)

  .delete(shippingCtrl.remove);

router.param('id', shippingCtrl.load);

export default router;
