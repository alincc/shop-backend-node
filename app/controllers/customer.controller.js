import Customer from '../models/Customer';

const load = (req, res, next, id) => {
  Customer.get(id)
    .then((customer) => {
      req.customer = customer;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const customer = new Customer({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    postnumber: req.body.postnumber,
    country: req.body.country,
    phone: req.body.phone,
    email: req.body.email,
    note: req.body.note,
  });

  customer.save()
    .then(customer => res.json({ message: 'Customer created!', data: customer }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Customer.list()
    .then(customer => res.json(customer))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.customer);

const remove = (req, res, next) => {
  const customer = req.customer;

  customer.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Customer
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .populate({
      path: 'orders',
      model: 'Order',
      populate: {
        path: 'payment',
        model: 'Payment',
      },
    })
    .exec()
    .then(customer => res.json({ message: 'Customer updated!', data: customer }))
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
