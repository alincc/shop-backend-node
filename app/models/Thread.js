import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  status: {
    type: Number,
    default: 0,
    enum: [1, 2, 3]
  },
  customer: {
    email: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true
});

ThreadSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate({
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'user',
          model: 'User',
        }
      })
      .exec()
      .then((thread) => {
        if (thread) {
          return thread;
        }
        const err = new APIError('No such thread exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .populate({
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'user',
          model: 'User',
        }
      })
      .exec();
  }
};

export default mongoose.model('Thread', ThreadSchema);
