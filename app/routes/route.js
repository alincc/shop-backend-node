import express from 'express';
import userRoutes from './user';
import orderRoutes from './order';
import productRoutes from './product';
import categoryRoutes from './category';
import customerRoutes from './customer';
import shippingRoutes from './shipping';
import authRoutes from './auth';
import paymentRoutes from './payment';
import attributeRoutes from './attribute';
import messageRoutes from './message';
import threadRoutes from './thread';
import settingsRoutes from './settings';
import variantRoutes from './variant';
import optionTypeRoutes from './option-type';
import optionValueRoutes from './option-value';
import imageUploadRoutes from './image-upload';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/customer', customerRoutes);
router.use('/shipping', shippingRoutes);
router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);
router.use('/attribute', attributeRoutes);
router.use('/message', messageRoutes);
router.use('/thread', threadRoutes);
router.use('/settings', settingsRoutes);
router.use('/variant', variantRoutes);
router.use('/option-type', optionTypeRoutes);
router.use('/option-value', optionValueRoutes);
router.use('/image-upload', imageUploadRoutes);

export default router;
