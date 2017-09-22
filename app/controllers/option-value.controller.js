import OptionValue from '../models/OptionValue';

const load = (req, res, next, id) => {
  OptionValue.get(id)
    .then((value) => {
      req.optionValue = value;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const value = new OptionValue({
    name: req.body.name,
    label: req.body.label,
    optionTypeName: req.body.optionTypeName,
    optionTypeId: req.body.optionTypeId,
    optionTypeLabel: req.body.optionTypeLabel,
  });

  value.save()
    .then(value => res.json({ message: 'OptionValue created!', data: value }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  OptionValue.list()
    .then(value => res.json(value))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.optionValue);

const remove = (req, res, next) => {
  const value = req.optionValue;

  value.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  OptionValue
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(value => res.json({ message: 'OptionValue updated!', data: value }))
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
