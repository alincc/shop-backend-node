import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema   = new Schema({
  admin: { type: Boolean, default: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  ip: String
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);
