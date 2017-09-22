import express from 'express';
import { optionValueCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The optionValue was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(optionValueCtrl.list)

  .post(optionValueCtrl.create);

router.route('/:id')
  .get(optionValueCtrl.get)

  .put(optionValueCtrl.update)

  .delete(optionValueCtrl.remove);

router.param('id', optionValueCtrl.load);

export default router;
