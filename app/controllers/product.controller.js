import Promise from 'bluebird';

import Product from '../models/Product';
import Category from '../models/Category';
import Variant from '../models/Variant';

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
    price: req.body.price,
    quantity: req.body.quantity,
    active: req.body.active,
    onSale: req.body.onSale,
    optionTypes: req.body.optionTypes,
    images: req.body.images,
  });

  product.save()
    .then((product) => {
      const createVariants = req.body.variants
        .map((variant) => {
          delete variant._id; // eslint-disable-line no-param-reassign
          variant.images = product.images;  // eslint-disable-line no-param-reassign
          return new Variant({ ...variant, product: product._id });
        })
        .map(variant => variant.save());

      return Promise.all(createVariants).then((variants) => {
        product.variants = variants;  // eslint-disable-line no-param-reassign

        return product.save();
      });
    })
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
    .then(() => Product.get(product._id))
    .then(product => res.json({ message: 'Product created!', data: product }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  const { limit = 50, skip = 0, query = '' } = req.query;

  Product.list({ limit, skip, query })
    .then(product => res.json(product))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.product);

const remove = (req, res, next) => {
  const { soft = 'true' } = req.query;

  const product = req.product;

  // Delete action either soft delete or hard
  return Promise.resolve()
    .then(soft === 'true' ? product.delete() : product.remove())
    .then(() => res.json({ message: 'Successfully deleted!', data: product }))
    .catch(e => next(e));
};

const restore = (req, res, next) => {
  const product = req.product;

  product.restore()
    .then(() => res.json({ message: 'Successfully restored!', data: product }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const variants = req.body.variants
    .map((variant) => {
      // Create new variant if it does not exist
      if (!variant._id) {
        delete variant._id; // eslint-disable-line no-param-reassign
        variant.images = req.product.images;  // eslint-disable-line no-param-reassign
        return new Variant({ ...variant, product: req.product._id }).save();
      }
      return Variant.findByIdAndUpdate(variant._id, variant, { new: true });
    });

  Promise.all(variants)
    .then((savedVariants) => {
      const body = Object.assign({}, req.body, {
        variants: savedVariants,
      });

      return Product
        .findByIdAndUpdate(req.params.id, body, { new: true })
        .populate('category')
        .populate({
          path: 'variants',
          model: 'Variant',
          populate: {
            path: 'options',
            model: 'OptionValue',
          },
        })
        .populate({
          path: 'optionTypes',
          model: 'OptionType',
          populate: {
            path: 'values',
            model: 'OptionValue',
          }
        })
        .exec();
    })
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
  restore,
};
