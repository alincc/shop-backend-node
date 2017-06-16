import Category from '../models/Category';

const load = (req, res, next, id) => {
  Category.get(id)
    .then((category) => {
      req.category = category;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const category = new Category({
    name: req.body.name,
    image: req.body.image,
  });

  category.save()
    .then(category => res.json({ message: 'Category created!', data: category }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Category.list()
    .then(category => res.json(category))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.category);

const remove = (req, res, next) => {
  const category = req.category;

  category.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Category
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(category => res.json({ message: 'Category updated!', data: category }))
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
