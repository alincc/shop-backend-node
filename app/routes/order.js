import express from 'express';
import { orderCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The order was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(orderCtrl.list)

  .post(orderCtrl.create);

router.route('/:id/add-message')
  .put(orderCtrl.addMessage);

router.route('/:id/add-product')
  .put(orderCtrl.addProduct);

router.route('/:id')
  .get(orderCtrl.get)

  .put(orderCtrl.update)

  .delete(orderCtrl.remove);


router.param('id', orderCtrl.load);

export default router;
