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

export default router;
