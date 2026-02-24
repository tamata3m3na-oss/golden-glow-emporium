import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { getProducts } from '@/data/products';
import { useCheckout } from './useCheckout';
import CheckoutProduct from './steps/CheckoutProduct';
import ConfirmMethod from './steps/ConfirmMethod';
import VerifyPhone from './steps/VerifyPhone';
import CardInfo from './steps/CardInfo';
import CardApproval from './steps/CardApproval';
import ConfirmCode from './steps/ConfirmCode';
import VerifyingCode from './steps/VerifyingCode';
import VerificationFailed from './steps/VerificationFailed';
import Success from './steps/Success';
import Cancelled from './steps/Cancelled';

const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const products = getProducts();
  const product = products.find(p => p.id === Number(id));

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

  const {
    agreedTerms,
    applyCoupon,
    cardCvv,
    cardExpiry,
    cardName,
    cardNumber,
    codeError,
    confirmCode,
    coupon,
    couponApplied,
    discount,
    finalPrice,
    formatPrice,
    formatTimer,
    handleCardSubmit,
    handleConfirmPayment,
    handleFinalConfirm,
    handleSendActivationCode,
    handleVerifyActivationCode,
    isVerifyingCode,
    orderId,
    paymentMethod,
    phoneNumber,
    resendTimer,
    setAgreedTerms,
    setCardCvv,
    setCardExpiry,
    setCardName,
    setCardNumber,
    setCodeError,
    setConfirmCode,
    setCoupon,
    setPaymentMethod,
    setPhoneNumber,
    setStep,
    setActivationCode,
    step,
    activationCode,
    verificationError,
    activeInstallments,
    activePerInstallment,
    activeTotalAmount,
  } = useCheckout(product, user);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CheckoutProduct
                user={user}
                product={product}
                coupon={coupon}
                couponApplied={couponApplied}
                discount={discount}
                finalPrice={finalPrice}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                setCoupon={setCoupon}
                applyCoupon={applyCoupon}
                onConfirm={handleConfirmPayment}
                formatPrice={formatPrice}
              />
            </motion.div>
          )}

          {step === 'confirm-method' && (
            <motion.div key="confirm-method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ConfirmMethod
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onBack={() => setStep('checkout')}
                onSubmit={handleSendActivationCode}
              />
            </motion.div>
          )}

          {step === 'verify-phone' && (
            <motion.div key="verify-phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <VerifyPhone
                phoneNumber={phoneNumber}
                activationCode={activationCode}
                setActivationCode={setActivationCode}
                agreedTerms={agreedTerms}
                setAgreedTerms={setAgreedTerms}
                codeError={codeError}
                resendTimer={resendTimer}
                formatTimer={formatTimer}
                isVerifyingCode={isVerifyingCode}
                onBack={() => setStep('confirm-method')}
                onSubmit={handleVerifyActivationCode}
                onClearError={() => setCodeError(null)}
              />
            </motion.div>
          )}

          {step === 'card-info' && (
            <motion.div key="card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CardInfo
                cardName={cardName}
                cardNumber={cardNumber}
                cardExpiry={cardExpiry}
                cardCvv={cardCvv}
                setCardName={setCardName}
                setCardNumber={setCardNumber}
                setCardExpiry={setCardExpiry}
                setCardCvv={setCardCvv}
                onBack={() => setStep('verify-phone')}
                onSubmit={handleCardSubmit}
              />
            </motion.div>
          )}

          {step === 'card-approval' && (
            <motion.div key="approval" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CardApproval />
            </motion.div>
          )}

          {step === 'cancelled' && (
            <motion.div key="cancelled" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Cancelled />
            </motion.div>
          )}

          {step === 'confirm-code' && (
            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ConfirmCode
                confirmCode={confirmCode}
                setConfirmCode={setConfirmCode}
                onSubmit={handleFinalConfirm}
              />
            </motion.div>
          )}

          {step === 'verifying-code' && (
            <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <VerifyingCode />
            </motion.div>
          )}

          {step === 'verification-failed' && (
            <motion.div key="verification-failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <VerificationFailed verificationError={verificationError} />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Success
                userName={user.name}
                orderId={orderId}
                product={product}
                activeTotalAmount={activeTotalAmount}
                activeInstallments={activeInstallments}
                activePerInstallment={activePerInstallment}
                formatPrice={formatPrice}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Checkout;
