import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  postnumber: { type: String, required: true },
  email: { type: String, required: true }, // TODO: should be required
  country: { type: String, required: true },
  phone: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  active: { type: Boolean, default: true },
  note: { type: String, default: '' },
}, {
  timestamps: true,
});

CustomerSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate({
        path: 'orders',
        model: 'Order',
        populate: {
          path: 'payment',
          model: 'Payment',
        },
      })
      .exec()
      .then((customer) => {
        if (customer) {
          return customer;
        }
        const err = new APIError('No such customer exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Customer', CustomerSchema);
