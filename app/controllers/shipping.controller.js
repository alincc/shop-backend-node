import Shipping from '../models/Shipping';

const load = (req, res, next, id) => {
  Shipping.get(id)
    .then((shipping) => {
      req.shipping = shipping;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const shipping = new Shipping({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
  });

  shipping.save()
    .then(shipping => res.json({ message: 'Shipping created!', data: shipping }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Shipping.list()
    .then(shipping => res.json(shipping))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.shipping);

const remove = (req, res, next) => {
  const shipping = req.shipping;

  shipping.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Shipping
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(shipping => res.json({ message: 'Shipping updated!', data: shipping }))
    .catch(e => next(e));
};

const removeMany = (req, res, next) => {
  const ids = req.body.ids || [];

  Shipping
    .remove({ _id: { $in: ids } })
    .then(() => res.json({ message: 'Carriers deleted', data: { ids } }))
    .catch(e => next(e));
};

export default {
  create,
  list,
  get,
  load,
  remove,
  removeMany,
  update,
};
