import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema   = new Schema({
  name: String,
  image: String,
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
});

export default mongoose.model('Category', CategorySchema);
