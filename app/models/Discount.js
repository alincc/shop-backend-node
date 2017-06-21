import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
  value: Number,
  startDate: Date,
  endDate: Date,
});

export default mongoose.model('Discount', DiscountSchema);
