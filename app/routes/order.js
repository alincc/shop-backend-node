import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Customer from '../models/Customer';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The order was not found', status: 404 });
  }

  next();
});

router.route('/')
  .get((req, res) => {
    Order.find((err, orders) => {
      if (err)
        return res.send(err);

      return res.json(orders);
    })
  })

  .post((req, res) => {
    let order = new Order();

    order.total = req.body.total;
    order.customer = req.body.customer;
    order.items = req.body.items;
    order.shipping = req.body.shipping;
    order.payment = req.body.payment;
    order.status = 0;
    order.statusLog.push({ status: 0 });

    order.save()
      .then(order => {
        return Customer.findById(order.customer).exec()
          .then(customer => [order, customer]);
      })
      .then(result => {
        let order = result[0];
        let customer = result[1];

        customer.orders.push(order);

        return customer.save().then(customer => [order, customer]);
      })
      .then(result => res.json({ message: 'Order created!', data: order }))
      .catch(err => res.send(err));
  });

router.route('/:id')
  .get((req, res) => {
    Order
      .findById(req.params.id)
      .populate('customer items.product shipping.value payment')
      .exec((err, order) => {
        if (err) return res.status(500).send(err);
        if (!order) return res.status(404).send({ data: null, message: 'The order was not found', status: 404 });

        return res.json(order);
    });
  })

  .put((req, res) => {

    let body = req.body || {}

    Order
      .findByIdAndUpdate(req.params.id, body, {new: true})
      .populate('customer items.product shipping.value payment')
      .exec((err, order) => {
        if (err) return res.send(err);

        if (!order.statusLog.find(log => log.status === body.status) &&
          body.status !== null &&
          typeof body.status != 'undefined'
        ) {
          order.statusLog.push({
            status: body.status,
          });

          order.save(err => {
            if (err) return res.send(err);
          });
        }

        return res.json({ message: 'Order updated!', data: order });
    });
  })

  .delete((req, res) => {
    Order.remove({
      _id: req.params.id
    }, (err, order) => {
      if (err)
        return res.send(err);

      return res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
