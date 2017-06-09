import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  name: { type: String, required: true },
  image: String,
  active: { type: Boolean, default: true },
});

export default mongoose.model('Payment', PaymentSchema);
