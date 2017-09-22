import Variant from '../models/Variant';

const load = (req, res, next, id) => {
  Variant.get(id)
    .then((variant) => {
      req.variant = variant;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const variant = new Variant({
    sku: req.body.sku,
    options: req.body.options,
    price: req.body.price,
    stock: req.body.stock,
    optionsText: req.body.optionsText,
  });

  variant.save()
    .then(variant => res.json({ message: 'Variant created!', data: variant }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Variant.list()
    .then(variant => res.json(variant))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.variant);

const remove = (req, res, next) => {
  const variant = req.variant;

  variant.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Variant
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(variant => res.json({ message: 'Variant updated!', data: variant }))
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
