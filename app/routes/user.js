import express from 'express';
import User from '../models/User';
import { isValid } from '../common/id-validator';

const router = express.Router();

router.use('/:id', (req, res, next) => {
  if (!isValid(req.params.id)) {
    return res.status(404).send({ data: null, message: 'The user was not found', status: 404 });
  }

  next();
});

router.route('/')
  .get((req, res) => {
    User.find((err, users) => {
      if (err)
        return res.send(err);

      res.json(users);
    })
  })

  .post((req, res) => {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;

    user.save((err) => {
      if (err)
        return res.send(err);

      res.json({ message: 'User created!' });
    });
  });

router.route('/:id')
  .get((req, res) => {

    User
      .findById(req.params.id)
      .populate('customer')
      .exec((err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send({ data: null, message: 'The user was not found', status: 404 });

        res.json(user);
    });
  })

  .put((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err)
        return res.send(err);

      user.username = req.body.username;
      user.password = req.body.password;
      user.email = req.body.email;
      user.customer = req.body.customer;

      user.save((err) => {
        if (err)
          return res.send(err);

        res.json({ message: 'User updated!' });
      });
    });
  })

  .delete((req, res) => {
    User.remove({
      _id: req.params.id
    }, (err, user) => {
      if (err)
        return res.send(err);

      res.json({ message: 'Successfully deleted!' });
    });
  });

export default router;
