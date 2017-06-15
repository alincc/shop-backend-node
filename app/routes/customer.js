import express from 'express';
import Customer from '../models/Customer';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The customer was not found', status: 404 });
  }

  next();
});

router.route('/')
  .get((req, res) => {
    Customer.find((err, customers) => {
      if (err) return res.send(err);

      res.json(customers);
    })
  })

  .post((req, res) => {
    var customer = new Customer();

    customer.firstname = req.body.firstname;
    customer.lastname = req.body.lastname;
    customer.address = req.body.address;
    customer.postnumber = req.body.postnumber;
    customer.country = req.body.country;
    customer.phone = req.body.phone;
    customer.email = req.body.email;
    customer.note = req.body.note;

    customer.save((err) => {
      if (err) return res.send(err);

      res.json({ message: 'Customer created!', data: customer });
    });
  });

router.route('/:id')
  .get((req, res) => {
    Customer
      .findById(req.params.id)
      // .populate('orders orders.payment')
      .populate({
        path: 'orders',
        model: 'Order',
        populate: {
          path: 'payment',
          model: 'Payment',
        },
      })
      .exec((err, customer) => {
        if (err) return res.status(500).send(err);
        if (!customer) return res.status(404).send({ data: null, message: 'The customer was not found', status: 404 });

        res.json(customer);
      });
  })

  .put((req, res) => {
    let body = req.body || {}

    Customer.findByIdAndUpdate(req.params.id, body, {new: true}, (err, customer) => {
      if (err) return res.send(err);

      customer.populate({
        path: 'orders',
        model: 'Order',
        populate: {
          path: 'payment',
          model: 'Payment',
        },
      }, (err, customer) => {
        if (err) return res.send(err);

        res.json({ message: 'Customer updated!', data: customer });
      });
    });
  })

  .delete((req, res) => {
    Customer.remove({
      _id: req.params.id
    }, (err, customer) => {
      if (err)
        return res.send(err);

      res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
