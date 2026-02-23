'use strict';

const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegram');

// Allowed fields for checkout events (strict allowlist)
const ALLOWED_FIELDS = new Set([
  'sessionId',
  'eventType',
  'userName',
  'userEmail',
  'productId',
  'productName',
  'productPrice',
  'amount',
  'paymentMethod',
  'installments',
  'phoneMasked',
  'orderId',
  'paymentStatus',
  'timestamp',
]);

// Sanitize event payload - only allow whitelisted fields
const sanitizePayload = (payload) => {
  const sanitized = {};
  for (const key of Object.keys(payload)) {
    if (ALLOWED_FIELDS.has(key)) {
      sanitized[key] = payload[key];
    }
  }
  return sanitized;
};

// Mask phone number if not already masked
const maskPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return null;
  // If already partially masked, return as-is
  if (phone.includes('****')) return phone;
  // Mask middle digits: 05X XXX XXXX -> 05****XXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 5) {
    const start = cleaned.substring(0, 2);
    const end = cleaned.substring(Math.max(cleaned.length - 4, 5));
    return `${start}****${end}`;
  }
  return '****';
};

// POST /api/checkout/events
// Accepts checkout events and forwards to Telegram
router.post('/events', async (req, res) => {
  try {
    const { sessionId, eventType } = req.body;

    // Basic validation
    if (!sessionId || !eventType) {
      return res.status(400).json({ error: 'sessionId and eventType are required' });
    }

    // Validate event type
    const validEventTypes = [
      'product_selected',
      'checkout_started',
      'payment_method_selected',
      'phone_entered',
      'phone_confirmed',
      'redirect_to_payment',
      'checkout_completed',
    ];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ error: 'Invalid eventType' });
    }

    // Sanitize payload - remove any sensitive fields
    const sanitized = sanitizePayload(req.body);

    // Mask phone number if provided
    if (sanitized.phoneMasked) {
      sanitized.phoneMasked = maskPhoneNumber(sanitized.phoneMasked);
    }

    // Send Telegram notification (non-blocking)
    telegramService.sendCheckoutEventNotification(sanitized).catch((err) => {
      console.error('[CheckoutEvents] Telegram notification failed:', err.message);
    });

    // Respond immediately (don't wait for Telegram)
    return res.status(202).json({ success: true, message: 'Event recorded' });
  } catch (err) {
    console.error('[CheckoutEvents] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
