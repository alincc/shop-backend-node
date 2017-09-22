import Promise from 'bluebird';

import OptionType from '../models/OptionType';
import OptionValue from '../models/OptionValue';

const load = (req, res, next, id) => {
  OptionType.get(id)
    .then((type) => {
      req.optionType = type;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const type = new OptionType({
    name: req.body.name,
    label: req.body.label,
  });

  type.save()
    .then((type) => {
      const values = req.body.values.map((value) => {
        const newValue = new OptionValue({
          ...value,
          label: value.name,  // TODO: label should be defined on the front end
          optionTypeId: type._id,
          optionTypeName: type.name,
          optionTypeLabel: type.label,
        });

        return newValue.save();
      });

      return Promise.all([
        type,
        Promise.all(values),
      ]);
    })
    .spread((type, values) => {
      type.values = values; // eslint-disable-line no-param-reassign

      return type.save();
    })
    .then(type => res.json({ message: 'OptionType created!', data: type }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  OptionType.list()
    .then(type => res.json(type))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.optionType);

const remove = (req, res, next) => {
  const type = req.optionType;

  const { soft = 'true' } = req.query;

  // Delete action either soft delete or hard
  return Promise.resolve()
    .then(type.remove())
    .then(() => res.json({ message: 'Successfully deleted!', data: type }))
    .catch(e => next(e));
  // return Promise.resolve()
  //   .then(soft === 'true' ? type.delete() : type.remove())
  //   .then(() => res.json({ message: 'Successfully deleted!', data: type }))
  //   .catch(e => next(e));
};

const update = (req, res, next) => {
  const type = req.optionType;
  const body = req.body || {};

  const optionValues = req.body.values.map((value) => {
    if (!value._id) {
      const newValue = new OptionValue({
        ...value,
        label: value.name,  // TODO: label should be defined on the front end
        optionTypeId: type._id,
        optionTypeName: type.name,
        optionTypeLabel: type.label,
      });

      return newValue.save();
    }

    const updatedValue = OptionValue
      .findByIdAndUpdate(value._id, { name: value.name }, { new: true })
      .exec();

    return updatedValue;
  });

  Promise.all(optionValues)
    .then(values => (
      OptionType
        .findByIdAndUpdate(req.params.id, { ...body, values }, { new: true })
        .populate('values')
        .exec()
    ))
    .then(type => res.json({ message: 'OptionType updated!', data: type }))
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
