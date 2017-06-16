import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  description: String,
  image: String,
  quantity: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  price: Number,
});

ProductSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('category')
      .exec()
      .then((product) => {
        if (product) {
          return product;
        }
        const err = new APIError('No such product exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .populate('category')
      .exec();
  }
};

export default mongoose.model('Product', ProductSchema);
