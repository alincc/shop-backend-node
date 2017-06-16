import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

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
  }],
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  statusLog: [{
    status: Number,
    createdAt: { type: Date, default: Date.now },
  }],
  shippingAddress: {
    email: String,
    phone: String,
    city: String,
    firstname: String,
    lastname: String,
    postnumber: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
  },
}, {
  timestamps: true,
});

OrderSchema.pre('findOneAndUpdate', (next) => {
  // console.log(this);
  next();
});

OrderSchema.pre('save', function(next) { // eslint-disable-line
  // console.log('2', this);
  next();
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
  }
};

export default mongoose.model('Order', OrderSchema);
