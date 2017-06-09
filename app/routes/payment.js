import express from 'express';
import mongoose from 'mongoose';
import Payment from '../models/Payment';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The payment was not found', status: 404 });
  }

  next();
});

router.route('/')
  .get((req, res) => {
    Payment.find((err, payments) => {
      if (err)
        return res.send(err);

      return res.json(payments);
    })
  })

  .post((req, res) => {
    let payment = new Payment();

    payment.name = req.body.name;
    payment.image = req.body.image;

    payment.save()
      .then(payment => {

        return res.json({ message: 'Payment created!', data: payment });
      })
      .catch(err => res.send(err));
  });

router.route('/:id')
  .get((req, res) => {
    Payment
      .findById(req.params.id)
      .exec((err, payment) => {
        if (err) return res.status(500).send(err);
        if (!payment) return res.status(404).send({ data: null, message: 'The payment was not found', status: 404 });

        return res.json(payment);
    });
  })

  .put((req, res) => {
    Payment.findById(req.params.id, (err, payment) => {
      if (err)
        return res.send(err);

      payment.name = req.body.name;
      payment.image = req.body.image;

      payment.save((err) => {
        if (err)
          return res.send(err);

        return res.json({ message: 'Payment updated!' });
      });

    });
  })

  .delete((req, res) => {
    Payment.remove({
      _id: req.params.id
    }, (err, payment) => {
      if (err)
        return res.send(err);

      return res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
