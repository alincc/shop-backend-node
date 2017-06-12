import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema   = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  name: String,
  description: String,
  image: String,
  quantity: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  price: Number,
});

export default mongoose.model('Product', ProductSchema);
