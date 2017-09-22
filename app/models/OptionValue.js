import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Promise from 'bluebird';

import APIError from '../helpers/APIError';

const Schema = mongoose.Schema;

const OptionValueSchema = new Schema({
  name: String,
  label: String,
  optionTypeName: String,
  optionTypeId: String,
  optionTypeLabel: String,
});

OptionValueSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((option) => {
        if (option) {
          return option;
        }
        const err = new APIError('No such option exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  list() {
    return this.find()
      .exec();
  }
};

export default mongoose.model('OptionValue', OptionValueSchema);
