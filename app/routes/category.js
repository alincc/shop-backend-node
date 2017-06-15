import express from 'express';
import Category from '../models/Category';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The category was not found', status: 404 });
  }

  next();
});

router.route('/')
  .get((req, res) => {
    Category.find((err, categories) => {
      if (err)
        return res.send(err);

      res.json(categories);
    })
  })

  .post((req, res) => {
    var category = new Category();
    category.name = req.body.name;
    category.image = req.body.image;

    category.save((err) => {
      if (err)
        return res.send(err);

      res.json({ message: 'Category created!' });
    });
  });

router.route('/:id')
  .get((req, res) => {
    Category
      .findById(req.params.id)
      .populate('products')
      .exec((err, category) => {
        if (err) return res.status(500).send(err);
        if (!category) return res.status(404).send({ data: null, message: 'The category was not found', status: 404 });

        res.json(category);
    });
  })

  .put((req, res) => {
    let body = req.body || {}

    Category
      .findByIdAndUpdate(req.params.id, body, {new: true})
      .populate('products')
      .exec((err, category) => {
        if (err) return res.send(err);

        return res.json({ message: 'Category updated!', data: category });
    });
  })

  .delete((req, res) => {
    Category.remove({
      _id: req.params.id
    }, (err, category) => {
      if (err)
        return res.send(err);

      res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
