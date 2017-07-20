import express from 'express';

import {
  messageCtrl
} from '../controllers';
import {
  isValid
} from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({
      data: null,
      message: 'The message was not found',
      status: 404
    });
  }

  return next();
});

router.route('/')
  .get(messageCtrl.list)

  .post(messageCtrl.create);

router.route('/:id')
  .get(messageCtrl.get)

  .put(messageCtrl.update)

  .delete(messageCtrl.remove);

router.param('id', messageCtrl.load);

export default router;
