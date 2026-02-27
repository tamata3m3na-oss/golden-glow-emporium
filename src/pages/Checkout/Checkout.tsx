import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { getProducts, type Product } from '@/data/products';
import { useCheckout } from './useCheckout';
import ConfirmMethod from './steps/ConfirmMethod';
import VerifyPhone from './steps/VerifyPhone';
import SelectPlan from './steps/SelectPlan';
import CardInfo from './steps/CardInfo';
import CardApproval from './steps/CardApproval';
import ConfirmCode from './steps/ConfirmCode';
import VerifyingCode from './steps/VerifyingCode';
import VerificationFailed from './steps/VerificationFailed';
import Success from './steps/Success';
import Cancelled from './steps/Cancelled';
import type { User } from '@/context/AuthContext';

interface CheckoutContentProps {
  product: Product;
  user: User;
}

const CheckoutContent = ({ product, user }: CheckoutContentProps) => {
  const navigate = useNavigate();

  const {
    agreedTerms,
    cardCvv,
    cardExpiry,
    cardName,
    cardNumber,
    codeError,
    confirmCode,
    confirmCodeError,
    formatPrice,
    formatTimer,
    handleCardSubmit,
    handleFinalConfirm,
    handleSendActivationCode,
    handleVerifyActivationCode,
    isConfirmingCode,
    isVerifyingCode,
    orderId,
    phoneNumber,
    resendTimer,
    setAgreedTerms,
    setCardCvv,
    setCardExpiry,
    setCardName,
    setCardNumber,
    setCodeError,
    setConfirmCode,
    setConfirmCodeError,
    setPhoneNumber,
    setSelectedPackage,
    setStep,
    setActivationCode,
    step,
    activationCode,
    verificationError,
    activeInstallments,
    activePerInstallment,
    activeTotalAmount,
  } = useCheckout(product, user);

  // SelectPlan is full-screen without Layout wrapper
  if (step === 'select-plan') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="select-plan"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <SelectPlan
            productPrice={product.price}
            onContinue={(selectedPackage) => {
              setSelectedPackage(selectedPackage);
              setStep('card-info');
            }}
            onBack={() => setStep('verify-phone')}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'confirm-method' && (
            <motion.div key="confirm-method" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ConfirmMethod
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                onBack={() => navigate(`/product/${product.id}`)}
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
                onBack={() => setStep('select-plan')}
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
                codeError={confirmCodeError}
                isLoading={isConfirmingCode}
                onClearError={() => setConfirmCodeError(null)}
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
              <VerificationFailed verificationError={verificationError} onRetry={() => setStep('confirm-code')} />
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

  return <CheckoutContent product={product} user={user} />;
};

export default Checkout;
