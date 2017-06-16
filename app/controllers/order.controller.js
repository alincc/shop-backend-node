import Order from '../models/Order';
import Customer from '../models/Customer';

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
    customer: req.body.customer,
    items: req.body.items,
    shipping: req.body.shipping,
    payment: req.body.payment,
    shippingAddress: req.body.shippingAddress,
    status: 0,
  });

  order.statusLog.push({ status: 0 });

  order.save()
    .then(order => Customer.findById(order.customer).exec().then(customer => [order, customer]))
    .then((result) => {
      const order = result[0];
      const customer = result[1];

      customer.orders.push(order);

      return customer.save().then(customer => [order, customer]);
    })
    .then(() => res.json({ message: 'Order created!', data: order }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Order.list()
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

const update = (req, res, next) => {
  const body = req.body || {};

  Order
    .findOneAndUpdate({ _id: req.params.id }, body, { new: true })
    .populate('customer items.product shipping.value payment')
    .exec()
    .then((order) => {
      if (!order.statusLog.find(log => log.status === body.status) &&
        body.status !== null &&
        typeof body.status !== 'undefined'
      ) {
        order.statusLog.push({
          status: body.status,
        });

        return order.save();
      }

      return order;
    })
    .then(order => res.json({ message: 'Order updated!', data: order }))
    .catch(e => next(e));
};

export default {
  create,
  list,
  get,
  load,
  remove,
  update,
};
