import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
  name: { type: String, default: '' },
  values: [{
    label: String,
    value: String,
  }],
});

AttributeSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((attribute) => {
        if (attribute) {
          return attribute;
        }
        const err = new APIError('No such attribute exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('Attribute', AttributeSchema);
