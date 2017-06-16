import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  name: { type: String, required: true },
  image: String,
  active: { type: Boolean, default: true },
});

PaymentSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((payment) => {
        if (payment) {
          return payment;
        }
        const err = new APIError('No such payment exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Payment', PaymentSchema);
