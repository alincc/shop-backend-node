import Attribute from '../models/Attribute';

const load = (req, res, next, id) => {
  Attribute.get(id)
    .then((attribute) => {
      req.attribute = attribute;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const attribute = new Attribute({
    name: req.body.name,
    values: req.body.values,
  });

  attribute.save()
    .then(attribute => res.json({ message: 'Attribute created!', data: attribute }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Attribute.list()
    .then(attribute => res.json(attribute))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.attribute);

const remove = (req, res, next) => {
  const attribute = req.attribute;

  attribute.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Attribute
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(attribute => res.json({ message: 'Attribute updated!', data: attribute }))
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
