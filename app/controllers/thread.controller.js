import Promise from 'bluebird';

import Thread from '../models/Thread';
import Message from '../models/Message';

const load = (req, res, next, id) => {
  Thread.get(id)
    .then((thread) => {
      req.thread = thread;
      return next();
    })
    .catch(e => next(e));
};

const create = (req, res, next) => {
  const thread = new Thread({
    messages: req.body.messages,
    order: req.body.order ? req.body.order : null,
  });

  thread.save()
    .then(thread => res.json({ thread: 'Thread created!', data: thread }))
    .catch(e => next(e));
};

const list = (req, res, next) => {
  Thread.list()
    .then(thread => res.json(thread))
    .catch(e => next(e));
};

const get = (req, res) => res.json(req.thread);

const remove = (req, res, next) => {
  const thread = req.thread;

  thread.remove()
    .then(() => res.json({ thread: 'Successfully deleted!' }))
    .catch(e => next(e));
};

const update = (req, res, next) => {
  const body = req.body || {};

  Thread
    .findByIdAndUpdate(req.params.id, body, { new: true })
    .exec()
    .then((thread) => {
      thread.populate({
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'user',
          model: 'User',
        }
      }, () =>
        res.json({ thread: 'Thread updated!', data: thread })
      );
    })
    .catch(e => next(e));
};

const addMessage = (req, res, next) => {
  const body = req.body || {};

  if (!body.threadId || !body.message) {
    res.status(500).send('Missing params');
  }

  const message = new Message(body.message);

  Promise.all([
    message.save(),
    Thread.get(body.threadId),
  ]).spread((message, thread) => {
    thread.messages.push(message);

    return thread.save();
  })
  .then((thread) => {
    thread.populate({
      path: 'messages',
      model: 'Message',
      populate: {
        path: 'user',
        model: 'User',
      }
    }, () =>
      res.json({ thread: 'Thread updated!', data: thread })
    );
  })
  .catch(e => next(e));
};

export default {
  create,
  list,
  get,
  load,
  remove,
  update,
  addMessage,
};
