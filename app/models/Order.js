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
    selectedCombination: {
      attributes: [],
      quantity: Number,
      _id: String,
    },
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
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }], // TODO: deprecate
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Thread',
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
      .populate({
        path: 'thread',
        model: 'Thread',
        populate: {
          path: 'messages',
          model: 'Message',
          populate: {
            path: 'user',
            model: 'User',
          },
        },
      })
      .populate({ // TODO: deprecate
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .exec()
      .then((order) => {
        if (order) {
          return order;
        }
        const err = new APIError('No such order exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 9999, sort = 'asc' } = {}) {
    return this.find()
      .populate('customer items.product shipping.value payment')
      .populate({
        path: 'thread',
        model: 'Thread',
        populate: {
          path: 'messages',
          model: 'Message',
          populate: {
            path: 'user',
            model: 'User',
          },
        },
      })
      .populate({ // TODO: deprecate
        path: 'messages',
        model: 'Message',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .sort({
        createdAt: sort
      })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  updateProductQuantity(items) {
    const promises = items.map(item => (
      Product.findById(item.product)
        .then((p) => {
          const product = p;

          if (p.combinations.length === 0) {
            if ((product.quantity - item.quantity) < 0) {
              throw new APIError('Not sufficient quantity for product', httpStatus.EXPECTATION_FAILED, true);
            }

            product.quantity -= item.quantity;

            return product.save();
          }

          if (item.selectedCombination) {
            product.combinations = product.combinations.map((combination) => {
              if (combination._id == item.selectedCombination._id) { // eslint-disable-line eqeqeq
                combination.quantity -= item.quantity; // eslint-disable-line no-param-reassign
              }
              return combination;
            });
          }

          return product.save();
        })
        .catch(e => Promise.reject(e))
    ));

    return Promise.all(promises);
  },
};

export default mongoose.model('Order', OrderSchema);
