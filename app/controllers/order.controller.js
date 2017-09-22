import Promise from 'bluebird';

import Order from '../models/Order';
import Variant from '../models/Variant';
import User from '../models/User';
import Thread from '../models/Thread';

const load = (req, res, next, id) => {
  Order.get(id)
    .then((order) => {
      req.order = order;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const order = new Order({
    total: req.body.total,
    // customer: req.body.customer,
    user: req.body.user,
    items: req.body.items,
    shipping: req.body.shipping,
    payment: req.body.payment,
    shippingAddress: req.body.shippingAddress,
    status: 0,
  });

  order.statusLog.push({ status: 0 });

  Promise.all([
    User.findById(req.body.user),
    order.save()
  ]).spread((user, order) => {
    user.orders.push(order);

    return user.save();
  })
  .then(() => req.body.items)
  .then(Order.updateProductQuantity)
  .then(() => res.json({ message: 'Order created!', data: order }))
  .catch(e => next(e));
};

const list = (req, res, next) => {
  const { limit = 50, skip = 0, sort = 'asc' } = req.query;

  Order.list({ limit, skip, sort })
    .then(order => res.json(order))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.order);

const remove = (req, res, next) => {
  const order = req.order;

  order.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const addProduct = (req, res, next) => {
  const order = req.order;
  const body = req.body || {};

  if (body.variant) {
    order.items.push(body);
  }

  order
    .save()
    .then(() => [req.body])
    .then(Order.updateProductQuantity)
    .then(() => Order.findById(order._id).populate('customer items.variant shipping.value payment').exec())
    .then(savedOrder => res.json({ message: 'Order updated!', data: savedOrder }))
    .catch(e => next(e));
};

const addThread = (req, res, next) => {
  const order = req.order;

  const thread = new Thread({
    messages: [],
    status: 0,
    order: req.order._id,
    customer: {
      email: req.order.shippingAddress.email,
      name: `${req.order.shippingAddress.firstname} ${req.order.shippingAddress.lastname}`,
    },
  });

  thread
    .save()
    .then((thread) => {
      order.thread = thread;

      return order.save();
    })
    .then(savedOrder => res.json({ message: 'Order updated!', data: savedOrder }))
    .catch(e => next(e));
};

const addMessage = (req, res, next) => {
  const order = req.order;
  const body = req.body || {};

  if (order.thread) {
    const thread = order.thread;

    thread.messages.push(body);

    thread
      .save()
      .then(() => Order.get(order._id))
      .then(savedOrder => res.json({ message: 'Order updated!', data: savedOrder }))
      .catch(e => next(e));
  } else {
    const thread = new Thread({
      messages: [body],
      order: req.order._id,
    });

    thread
      .save()
      .then((thread) => {
        order.thread = thread;

        return order.save();
      })
      .then(() => Order.get(order._id))
      .then(savedOrder => res.json({ message: 'Order updated!', data: savedOrder }))
      .catch(e => next(e));
  }
};

const update = (req, res, next) => {
  const order = req.order;
  const body = req.body || {};
  const variantPromises = [];

  if (!order.statusLog.find(log => log.status === body.status) &&
    body.status !== null &&
    typeof body.status !== 'undefined'
  ) {
    order.statusLog.push({
      status: body.status,
    });
  }

  if (typeof body.items !== 'undefined') {
    let prevLine;
    let diff;

    body.items.forEach((item) => {
      prevLine = order.items.find(i => i.variant == item.variant._id); // eslint-disable-line eqeqeq

      diff = prevLine.quantity - item.quantity;

      // Check if there is a difference in quantity
      if (diff !== 0) {
        variantPromises.push(
          Variant.findByIdAndUpdate(item.variant._id, { $inc: { stock: diff } }).exec()
        );
      }
    });
  }

  order.total = body.total ? body.total : order.total;
  order.customer = body.customer ? body.customer : order.customer;
  order.items = body.items ? body.items : order.items;
  order.shipping = body.shipping ? body.shipping : order.shipping;
  order.payment = body.payment ? body.payment : order.payment;
  order.shippingAddress = body.shippingAddress ? body.shippingAddress : order.shippingAddress;
  order.status = body.status ? body.status : order.status;

  Promise.all([
    order.save(),
    Promise.all(variantPromises),
  ]).spread((order, variants) => {    // eslint-disable-line no-unused-vars
    const subtotal = order.items
      .reduce((total, item) => total + (item.price * item.quantity), 0);

    const shipping = order.shipping ? order.shipping.price : 0;

    order.total = subtotal + shipping; // eslint-disable-line no-param-reassign

    return order.save();
  })
  .then(() => Order.findById(order._id).populate('items.variant shipping.value payment').exec())
  .then(savedOrder => res.json({ message: 'Order updated!', data: savedOrder }))
  .catch(e => next(e));
};

export default {
  create,
  list,
  get,
  load,
  remove,
  update,
  addProduct,
  addThread,
  addMessage,
};
