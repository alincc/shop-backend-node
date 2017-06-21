import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const ShippingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: { type: Number, required: true },
  description: String,
  active: { type: Boolean, default: true },
});

ShippingSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((shipping) => {
        if (shipping) {
          return shipping;
        }
        const err = new APIError('No such shipping exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Shipping', ShippingSchema);
