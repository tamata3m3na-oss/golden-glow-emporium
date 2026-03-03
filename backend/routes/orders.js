'use strict';

const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const telegramService = require('../services/telegram');

// POST /api/orders
router.post('/', async (req, res) => {
  const {
    userName, userEmail, userPhone,
    productId, amount, paymentMethod,
    installments, perInstallment, commission,
    netTransfer, couponApplied, discount,
  } = req.body;

  if (!userName || !userEmail || !productId || !amount || !paymentMethod) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: userName, email: userEmail, phone: userPhone || null },
      });
    } else if (userPhone && !user.phone) {
      user = await prisma.user.update({ where: { id: user.id }, data: { phone: userPhone } });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        productId: product.id,
        amount: parseFloat(amount),
        paymentMethod,
        installments: parseInt(installments) || 1,
        perInstallment: parseFloat(perInstallment) || parseFloat(amount),
        commission: parseFloat(commission) || 0,
        netTransfer: parseFloat(netTransfer) || parseFloat(amount),
        couponApplied: Boolean(couponApplied),
        discount: parseFloat(discount) || 0,
        status: 'pending',
        paymentStatus: 'pending',
      },
      include: { user: true, product: true },
    });

    telegramService.sendNewOrderNotification({
      id: order.id,
      userName: user.name,
      userEmail: user.email,
      productName: product.name,
      amount: order.amount,
      paymentMethod: order.paymentMethod,
      installments: order.installments,
      perInstallment: order.perInstallment,
      commission: order.commission,
      netTransfer: order.netTransfer,
    }).catch(console.error);

    res.status(201).json({ orderId: order.id, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { user: true, product: true },
    });
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

module.exports = router;
