import express from 'express';
import { categoryCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The category was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(categoryCtrl.list)

  .post(categoryCtrl.create);

router.route('/:id')
  .get(categoryCtrl.get)

  .put(categoryCtrl.update)

  .delete(categoryCtrl.remove);

router.param('id', categoryCtrl.load);

export default router;
