import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ShippingSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
});

export default mongoose.model('Shipping', ShippingSchema);
