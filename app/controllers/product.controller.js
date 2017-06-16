import Product from '../models/Product';
import Category from '../models/Category';

const load = (req, res, next, id) => {
  Product.get(id)
    .then((product) => {
      req.product = product;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {

  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    quantity: req.body.quantity,
    active: req.body.active,
  });

  product.save()
    .then(() => {
      const categoryId = req.body.category;

      return Category.findById(categoryId).exec();
    })
    .then((category) => {
      if (req.body.category) {
        category.products.push(product);

        return category.save();
      }
      return product;
    })
    .then(() => res.json({ message: 'Product created!', data: product }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Product.list()
    .then(product => res.json(product))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.product);

const remove = (req, res, next) => {
  const product = req.product;

  product.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Product
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .populate('category')
    .exec()
    .then(product => res.json({ message: 'Product updated!', data: product }))
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
