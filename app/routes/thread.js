import express from 'express';

import {
  threadCtrl
} from '../controllers';
import {
  isValid
} from '../common/id-validator';

const router = express.Router();

router.route('/')
  .get(threadCtrl.list)

  .post(threadCtrl.create);

router.route('/add-message')
  .post(threadCtrl.addMessage);

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({
      data: null,
      message: 'The thread was not found',
      status: 404
    });
  }

  return next();
});

router.route('/:id')
  .get(threadCtrl.get)

  .put(threadCtrl.update)

  .delete(threadCtrl.remove);

router.param('id', threadCtrl.load);

export default router;
