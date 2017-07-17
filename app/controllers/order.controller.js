import Order from '../models/Order';
import Customer from '../models/Customer';
import Product from '../models/Product';

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

      customer.save().then(customer => [order, customer]);

      return req.body.items;
    })
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

  if (body.product) {
    order.items.push(body);
  }

  order
    .save()
    .then(() => [req.body])
    .then(Order.updateProductQuantity)
    .then(() => Order.findById(order._id).populate('customer items.product shipping.value payment').exec())
    .then(savedOrder => res.json({ message: 'Order updated!', data: savedOrder }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const order = req.order;
  const body = req.body || {};

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
      prevLine = order.items.find(i => i.product._id == item.product._id); /* eslint eqeqeq:0 */

      diff = prevLine.quantity - item.quantity;

      // Check if there is a difference in quantity
      if (diff !== 0) {
        Product.findByIdAndUpdate(item.product._id, { $inc: { quantity: diff } })
          .catch(e => next(e));
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

  order
    .save()
    .then(() => Order.findById(order._id).populate('customer items.product shipping.value payment').exec())
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
};
