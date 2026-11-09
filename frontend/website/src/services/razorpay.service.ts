import { apiFetch } from './api-client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpaySuccessResult {
  success: boolean;
  bookingCode: string;
  paymentId: string;
  orderId: string;
  invoiceNumber: string;
  booking: any;
}

export interface LaunchRazorpayParams {
  packageId?: string;
  itemType: 'tour' | 'car' | 'tours' | 'fleet';
  itemTitle: string;
  amount: number; // Deposit in INR
  totalAmount?: number;
  balanceAmount?: number;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate?: string;
  endDate?: string;
  guestsCount?: number;
  pickupLocation?: string;
  notes?: string;
  passengers?: Array<{
    seatNo?: number | string;
    name: string;
    age: number | string;
    gender: string;
  }>;
  bookingDetails?: Record<string, any>;
  onSuccess?: (data: RazorpaySuccessResult) => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
}

// Backward compatibility alias
export type RazorpayCheckoutOptions = LaunchRazorpayParams;

/**
 * Dynamically load Razorpay standard Checkout script
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Main Razorpay Checkout Initiator
 * Returns a Promise that resolves upon successful verification
 */
export async function launchRazorpayPayment(options: LaunchRazorpayParams): Promise<RazorpaySuccessResult> {
  const serviceType = options.itemType === 'tour' || options.itemType === 'tours' ? 'tours' : 'fleet';
  const bookingCode = options.bookingCode;
  const mergedDetails = {
    bookingCode: bookingCode,
    id: bookingCode,
    title: options.itemTitle,
    packageId: options.packageId,
    packageName: options.itemTitle,
    vehicleName: options.itemTitle,
    customerName: options.customerName,
    customerEmail: options.customerEmail,
    customerPhone: options.customerPhone,
    startDate: options.travelDate,
    endDate: options.endDate,
    travelDate: options.travelDate,
    guestsCount: options.guestsCount || 1,
    paxCount: options.guestsCount || 1,
    pickupLocation: options.pickupLocation || 'pune-swargate',
    specialNotes: options.notes,
    passengers: options.passengers || options.bookingDetails?.passengers || [],
    totalPrice: options.totalAmount || options.amount,
    totalAmount: options.totalAmount || options.amount,
    depositPaid: options.amount,
    balanceAmount: options.balanceAmount || 0,
    ...(options.bookingDetails || {}),
  };

  return new Promise<RazorpaySuccessResult>(async (resolve, reject) => {
    try {
      // 1. Create order on Express backend
      const order = await apiFetch<any>('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          amount: options.amount,
          service_type: serviceType,
          customer_name: options.customerName,
          customer_email: options.customerEmail,
          customer_phone: options.customerPhone,
          title: options.itemTitle,
          reference_id: bookingCode,
          notes: {
            packageName: options.itemTitle,
            guests: String(options.guestsCount || 1),
            travelDate: String(options.travelDate || ''),
          },
        }),
      });

      if (!order || !order.id) {
        throw new Error('Failed to initialize payment order with server');
      }

      // 2. Load and launch official Razorpay Checkout modal
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
      }

      const rzpOptions = {
        key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TxySKBT8g4HVD5',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Aarambha Tours & Travels',
        description: `${options.itemTitle} • Advance Deposit`,
        image: '/images/logo.jpeg',
        order_id: order.id,
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
          contact: options.customerPhone,
        },
        notes: {
          service_type: serviceType,
          booking_title: options.itemTitle,
        },
        theme: {
          color: '#101F40', // Brand Navy
          backdrop_color: '#0A1329',
        },
        modal: {
          ondismiss: () => {
            if (options.onDismiss) options.onDismiss();
            reject(new Error('Payment window closed.'));
          },
        },
        handler: async (response: any) => {
          try {
            // Verify with backend
            const verifyRes = await apiFetch<any>('/api/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                service_type: serviceType,
                ...mergedDetails,
                depositPaid: options.amount,
              }),
            });

            const successData: RazorpaySuccessResult = {
              success: true,
              bookingCode: verifyRes.bookingCode || bookingCode,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              invoiceNumber: verifyRes.invoiceNumber || 'AT/TT/2026/00148',
              booking: verifyRes.booking || mergedDetails,
            };

            if (options.onSuccess) options.onSuccess(successData);
            resolve(successData);
          } catch (err: any) {
            const errorMsg = err.message || 'Payment verification failed. Please contact support.';
            if (options.onError) options.onError(errorMsg);
            reject(new Error(errorMsg));
          }
        },
      };

      const rzpInstance = new window.Razorpay(rzpOptions);
      rzpInstance.on('payment.failed', function (resp: any) {
        const errorMsg = resp.error?.description || 'Payment was declined or failed.';
        if (options.onError) options.onError(errorMsg);
        reject(new Error(errorMsg));
      });

      rzpInstance.open();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to initiate payment.';
      if (options.onError) options.onError(errorMsg);
      reject(new Error(errorMsg));
    }
  });
}
