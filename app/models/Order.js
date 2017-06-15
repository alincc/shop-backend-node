import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  total: Number,
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: Number,
  shipping: {
    value: { type: Schema.Types.ObjectId, ref: 'Shipping' },
    trackingNumber: String,
    price: Number,
    weight: Number,
  },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
  }],
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  statusLog: [{
    status: Number,
    createdAt: { type: Date, default: Date.now },
  }],
  shippingAddress: {
    email: String,
    phone: String,
    city: String,
    firstname: String,
    lastname: String,
    postnumber: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
  },
}, {
  timestamps: true,
});

export default mongoose.model('Order', OrderSchema);
