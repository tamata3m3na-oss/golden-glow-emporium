'use strict';

const approvalStore = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

const createPending = (sessionId, meta = {}) => {
  const record = {
    status: 'pending',
    createdAt: Date.now(),
    meta,
  };
  approvalStore.set(sessionId, record);
  return record;
};

const setStatus = (sessionId, status) => {
  const record = approvalStore.get(sessionId);
  if (record) {
    record.status = status;
    approvalStore.set(sessionId, record);
  }
  return record;
};

const getStatus = (sessionId) => {
  const record = approvalStore.get(sessionId);
  if (!record) return null;

  // Check TTL
  if (Date.now() - record.createdAt > TTL_MS) {
    approvalStore.delete(sessionId);
    return null;
  }

  return record.status;
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
  clear,
};
