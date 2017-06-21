import express from 'express';
import { attributeCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The attribute was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(attributeCtrl.list)

  .post(attributeCtrl.create);

router.route('/:id')
  .get(attributeCtrl.get)

  .put(attributeCtrl.update)

  .delete(attributeCtrl.remove);

router.param('id', attributeCtrl.load);

export default router;
