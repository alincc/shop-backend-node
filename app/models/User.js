import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  admin: { type: Boolean, default: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  ip: String
}, {
  timestamps: true
});

UserSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('customer')
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('User', UserSchema);
