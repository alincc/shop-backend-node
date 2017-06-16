import express from 'express';

import Product from '../models/Product';
import {
  productCtrl
} from '../controllers';
import {
  isValid
} from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({
      data: null,
      message: 'The product was not found',
      status: 404
    });
  }

  return next();
});

router.route('/search')
  .get((req, res) => {
    if (!req.param('query')) {
      return res.json([]);
    }

    Product.find({
      name: new RegExp(req.query.query, 'i')
    }, (err, products) => {
      if (err) {
        return res.status(500).send(err);
      }

      return res.json(products);
    });

  });

router.route('/')
  .get(productCtrl.list)

  .post(productCtrl.create);

router.route('/:id')
  .get(productCtrl.get)

  .put(productCtrl.update)

  .delete(productCtrl.remove);

router.param('id', productCtrl.load);

export default router;
