import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: String,
  image: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
});

CategorySchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('products')
      .exec()
      .then((category) => {
        if (category) {
          return category;
        }
        const err = new APIError('No such category exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Category', CategorySchema);
