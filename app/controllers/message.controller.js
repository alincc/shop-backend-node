import Message from '../models/Message';

const load = (req, res, next, id) => {
  Message.get(id)
    .then((message) => {
      req.message = message;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const message = new Message({
    body: req.body.body,
    user: req.body.user,
  });

  message.save()
    .then(message => res.json({ message: 'Message created!', data: message }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Message.list()
    .then(message => res.json(message))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.message);

const remove = (req, res, next) => {
  const message = req.message;

  message.remove()
    .then(() => res.json({ message: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Message
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then(message => res.json({ message: 'Message updated!', data: message }))
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
