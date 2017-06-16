import Payment from '../models/Payment';

const load = (req, res, next, id) => {
  Payment.get(id)
    .then((payment) => {
      req.payment = payment;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const payment = new Payment({
    name: req.body.name,
    image: req.body.image,
  });

  payment.save()
    .then(payment => res.json({ message: 'Payment created!', data: payment }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Payment.list()
    .then(payment => res.json(payment))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.payment);

const remove = (req, res, next) => {
  const payment = req.payment;

  payment.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Payment
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(payment => res.json({ message: 'Payment updated!', data: payment }))
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
