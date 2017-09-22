import express from 'express';
import { optionTypeCtrl } from '../controllers';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The optionType was not found', status: 404 });
  }

  return next();
});

router.route('/')
  .get(optionTypeCtrl.list)

  .post(optionTypeCtrl.create);

router.route('/:id')
  .get(optionTypeCtrl.get)

  .put(optionTypeCtrl.update)

  .delete(optionTypeCtrl.remove);

router.param('id', optionTypeCtrl.load);

export default router;
