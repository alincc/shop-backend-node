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
    price: Number,
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

OrderSchema.pre('findOneAndUpdate', function (next) { // eslint-disable-line
  // console.log(this.getUpdate());
  next();
});

OrderSchema.pre('save', function(next) { // eslint-disable-line
  // console.log("this", this);
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
