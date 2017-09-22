import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const VariantSchema = new Schema({
  name: String,
  description: String,
  product: {
    type: Schema.ObjectId,
    ref: 'Product',
  },
  sku: {
    type: String,
    default: null,
  },
  options: [{
    type: Schema.ObjectId,
    ref: 'OptionValue',
  }],
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  optionsText: {
    type: String,
    default: '',
  },
  images: [{
    url: String,
    label: String,
    main: Boolean,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  }],
  master: {
    type: Boolean,
    default: false,
  },
});

VariantSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((variant) => {
        if (variant) {
          return variant;
        }
        const err = new APIError('No such variant exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Variant', VariantSchema);
