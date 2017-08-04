import express from 'express';

import {
  settingsCtrl
} from '../controllers';

const router = express.Router();

router.route('/')
  .get(settingsCtrl.list)

  .post(settingsCtrl.create)

  .put(settingsCtrl.update);

export default router;
