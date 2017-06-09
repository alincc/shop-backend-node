import express from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The product was not found', status: 404 });
  }

  next();
});

router.route('/search')
  .get((req, res) => {
    if (!req.param('query')) {
      return res.json([]);
    }

    Product.find({ name: new RegExp(req.query.query, 'i') }, (err, products) => {
      if (err) {
        return res.status(500).send(err);
      }

      return res.json(products);
    });

  });

router.route('/')
  .get((req, res) => {
    Product.find((err, products) => {
      if (err) return res.status(500).send(err);
      if (!products) return res.status(404).send({ data: null, message: 'No products found', status: 404 });

      res.json(products);
    })
  })

  .post((req, res) => {

    let product = new Product();
    product.name = req.body.name;
    product.category = req.body.category;
    product.description = req.body.description;
    product.image = req.body.image;
    product.price = req.body.price;

    product.save((err) => {
      if (err) return res.send(err);

      let categoryId = req.body.category;
      // Get category
      if (categoryId !== null) {
        Category.findById(categoryId, (err, category) => {
          if (err) return res.send(err);

          category.products.push(product);

          category.save((err) => {
            if (err) return res.send(err);

            res.json({ message: 'Product created!' });
          })
        });
      }
    });
  });

router.route('/:id')
  .get((req, res) => {
    Product
      .findById(req.params.id)
      .populate('category')
      .exec((err, product)  => {
        if (err) return res.status(500).send(err);
        if (!product) return res.status(404).send({ data: null, message: 'The product was not found', status: 404 });

        res.json(product);
    });
  })

  .put((req, res) => {
    Product.findById(req.params.id, (err, product) => {
      if (err)
        return res.send(err);

      product.name = req.body.name;

      product.save((err) => {
        if (err)
          return res.send(err);

        res.json({ message: 'Product updated!' });
      });

    });
  })

  .delete((req, res) => {
    Product.remove({
      _id: req.params.id
    }, (err, product) => {
      if (err)
        return res.send(err);

      res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
