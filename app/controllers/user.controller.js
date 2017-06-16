import User from '../models/User';

const load = (req, res, next, id) => {
  User.get(id)
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  user.save()
    .then(user => res.json({ message: 'User created!', data: user }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  User.list()
    .then(user => res.json(user))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.user);

const remove = (req, res, next) => {
  const user = req.user;

  user.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  User
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(user => res.json({ message: 'User updated!', data: user }))
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
