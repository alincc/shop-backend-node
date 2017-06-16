import express from 'express';
import { customerCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The customer was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(customerCtrl.list)

  .post(customerCtrl.create);

router.route('/:id')
  .get(customerCtrl.get)

  .put(customerCtrl.update)

  .delete(customerCtrl.remove);

router.param('id', customerCtrl.load);

export default router;
