import express from 'express';
import { variantCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The variant was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(variantCtrl.list)

  .post(variantCtrl.create);

router.route('/:id')
  .get(variantCtrl.get)

  .put(variantCtrl.update)

  .delete(variantCtrl.remove);

router.param('id', variantCtrl.load);

export default router;
