import express from 'express';

import {
  userCtrl
} from '../controllers';
import {
  isValid
} from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({
      data: null,
      message: 'The user was not found',
      status: 404
    });
  }

  return next();
});

router.route('/')
  .get(userCtrl.list)

  .post(userCtrl.create);

router.route('/:id')
  .get(userCtrl.get)

  .put(userCtrl.update)

  .delete(userCtrl.remove);

router.param('id', userCtrl.load);

export default router;
