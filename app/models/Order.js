import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  total: Number,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: Number,
  shipping: { type: Schema.Types.ObjectId, ref: 'Shipping' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
}, {
  timestamps: true,
});

export default mongoose.model('Order', OrderSchema);
