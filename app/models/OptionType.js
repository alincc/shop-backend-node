import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const OptionTypeSchema = new Schema({
  name: String,
  label: String,
  values: [{
    type: Schema.ObjectId,
    ref: 'OptionValue',
  }],
});

OptionTypeSchema.statics = {
  get(id) {
    return this.findById(id)
      .populate('values')
      .exec()
      .then((option) => {
        if (option) {
          return option;
        }
        const err = new APIError('No such option type exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .populate('values')
      .exec();
  }
};

export default mongoose.model('OptionType', OptionTypeSchema);
