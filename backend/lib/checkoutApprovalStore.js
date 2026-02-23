'use strict';

const approvalStore = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

const createPending = (sessionId, meta = {}) => {
  const record = {
    status: 'pending',
    createdAt: Date.now(),
    meta,
    verificationCode: null,
    verificationResult: null,
  };
  approvalStore.set(sessionId, record);
  return record;
};

const setStatus = (sessionId, status, reason = null) => {
  const record = approvalStore.get(sessionId);
  if (record) {
    record.status = status;
    record.reason = reason;
    approvalStore.set(sessionId, record);
  }
  return record;
};

const getStatusWithReason = (sessionId) => {
  const record = approvalStore.get(sessionId);
  if (!record) return null;

  // Check TTL
  if (Date.now() - record.createdAt > TTL_MS) {
    approvalStore.delete(sessionId);
    return null;
  }

  return {
    status: record.status,
    reason: record.reason || null,
  };
};

const getStatus = (sessionId) => {
  const result = getStatusWithReason(sessionId);
  return result ? result.status : null;
};

const setVerificationCode = (sessionId, code) => {
  const record = approvalStore.get(sessionId);
  if (record) {
    record.verificationCode = code;
    record.status = 'verifying';
    approvalStore.set(sessionId, record);
  }
  return record;
};

const setVerificationResult = (sessionId, result) => {
  const record = approvalStore.get(sessionId);
  if (record) {
    record.verificationResult = result;
    // Map result to status
    const statusMap = {
      'correct': 'code_correct',
      'incorrect': 'code_incorrect',
      'nobalance': 'no_balance',
      'rejected': 'card_rejected',
    };
    record.status = statusMap[result] || result;
    approvalStore.set(sessionId, record);
  }
  return record;
};

const getRecord = (sessionId) => {
  const record = approvalStore.get(sessionId);
  if (!record) return null;

  // Check TTL
  if (Date.now() - record.createdAt > TTL_MS) {
    approvalStore.delete(sessionId);
    return null;
  }

  return {
    status: record.status,
    verificationCode: record.verificationCode,
    verificationResult: record.verificationResult,
    meta: record.meta,
  };
};

const clear = (sessionId) => {
  approvalStore.delete(sessionId);
};

// Cleanup expired records periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, record] of approvalStore.entries()) {
    if (now - record.createdAt > TTL_MS) {
      approvalStore.delete(sessionId);
    }
  }
}, 60 * 1000); // Run every minute

module.exports = {
  createPending,
  setStatus,
  getStatus,
  getStatusWithReason,
  setVerificationCode,
  setVerificationResult,
  getRecord,
  clear,
};
