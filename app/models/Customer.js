import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CustomerSchema   = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  postnumber: { type: String, required: true },
  email: { type: String, required: true }, // TODO: should be required
  country: { type: String, required: true },
  phone: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  active: { type: Boolean, default: true },
  note: { type: String, default: '' },
}, {
  timestamps: true,
});

export default mongoose.model('Customer', CustomerSchema);
