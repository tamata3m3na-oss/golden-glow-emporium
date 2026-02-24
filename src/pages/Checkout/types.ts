export type PaymentMethod = 'tamara' | 'tabby' | null;

export type Step =
  | 'checkout'
  | 'confirm-method'
  | 'verify-phone'
  | 'card-info'
  | 'card-approval'
  | 'confirm-code'
  | 'verifying-code'
  | 'success'
  | 'cancelled'
  | 'verification-failed';

export interface CheckoutState {
  coupon: string;
  couponApplied: boolean;
  paymentMethod: PaymentMethod;
  installments: number;
  step: Step;
  phoneNumber: string;
  activationCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  confirmCode: string;
  agreedTerms: boolean;
  verificationError: string | null;
  codeError: string | null;
}

export interface InstallmentPackage {
  totalAmount: number;
  installmentsCount: number;
  perInstallment: number;
  commission: number;
  netTransfer: number;
}
