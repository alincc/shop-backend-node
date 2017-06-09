import express from 'express';
import Shipping from '../models/Shipping';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The shipping was not found', status: 404 });
  }

  next();
});

router.route('/')
  .get((req, res) => {
    Shipping.find((err, shipping) => {
      if (err) return res.send(err);

      res.json(shipping);
    })
  })

  .post((req, res) => {
    let shipping = new Shipping();

    shipping.name = req.body.name;
    shipping.price = req.body.price;
    shipping.description = req.body.description;

    shipping.save((err) => {
      if (err) return res.send(err);

      res.json({ message: 'Shipping created!', data: shipping });
    });
  });

router.route('/:id')
  .get((req, res) => {
    Shipping.findById(req.params.id, (err, shipping) => {
      if (err) return res.status(500).send(err);
      if (!shipping) return res.status(404).send({ data: null, message: 'The shipping was not found', status: 404 });

      res.json(shipping);
    });
  })

  .put((req, res) => {
    Shipping.findById(req.params.id, (err, shipping) => {
      if (err) return res.send(err);

      shipping.name = req.body.name;
      shipping.price = req.body.price;
      shipping.description = req.body.description;

      shipping.save((err) => {
        if (err) return res.send(err);

        res.json({ message: 'Shipping updated!', data: shipping });
      });

    });
  })

  .delete((req, res) => {
    Shipping.remove({
      _id: req.params.id
    }, (err, shipping) => {
      if (err)
        return res.send(err);

      res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
