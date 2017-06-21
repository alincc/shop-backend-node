import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';
import Product from '../models/Product';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  total: Number,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: Number,
  shipping: {
    value: { type: Schema.Types.ObjectId, ref: 'Shipping' },
    trackingNumber: String,
    price: Number,
    weight: Number,
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number,
    combination: [{
      attribute: {
        name: String,
      },
      value: {
        label: String,
        value: String,
      },
    }],
  }],
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  statusLog: [{
    status: Number,
    createdAt: { type: Date, default: Date.now },
  }],
  shippingAddress: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    postnumber: { type: String, default: '' },
    address: { type: String, default: '' },
    country: { type: String, default: '' },
  },
}, {
  timestamps: true,
});

OrderSchema.methods = {
  addStatus: (status) => {
    this.statusLog.push({ status });

    return this.save();
  },
};

OrderSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('customer items.product shipping.value payment')
      .exec()
      .then((order) => {
        if (order) {
          return order;
        }
        const err = new APIError('No such order exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  },

  updateProductQuantity(items) {
    const promises = items.map(item => (
      Product.findById(item.product)
        .then((p) => {
          const product = p;
          if ((product.quantity - item.quantity) < 0) {
            throw new APIError('Not sufficient quantity for product', httpStatus.EXPECTATION_FAILED, true);
          }

          product.quantity -= item.quantity;

          return product.save();
        })
        .catch(e => Promise.reject(e))
    ));

    return Promise.all(promises);
  },
};

export default mongoose.model('Order', OrderSchema);
