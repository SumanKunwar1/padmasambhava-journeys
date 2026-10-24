// src/services/invoices.ts
import axiosInstance from '@/lib/axios';

export type InvoiceCurrency = 'USD' | 'INR' | 'NPR';
export const INVOICE_CURRENCIES: InvoiceCurrency[] = ['USD', 'INR', 'NPR'];

export const PAYMENT_TYPES = ['Full payment', 'Advance payment', 'Partial payment', 'Final payment'] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const PAYMENT_METHODS = [
  'International wire',
  'Bank transfer',
  'UPI',
  'Card',
  'Cash',
  'Cheque',
  'PayPal',
];

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceClient {
  name: string;
  address?: string;
  country?: string;
  nationality?: string;
  phone?: string;
  email?: string;
}

export interface Payment {
  _id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paidBy: string;
  method: string;
  transactionId?: string;
  paymentType: PaymentType;
  note?: string;
  createdAt: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  booking?: string;
  bookingRef?: string;
  issueDate: string;
  dueDate?: string;
  currency: InvoiceCurrency;
  client: InvoiceClient;
  packageName?: string;
  travelDate?: string;
  travellers?: number;
  items: InvoiceItem[];
  discount: number;
  taxPercent: number;
  notes?: string;
  status: 'Issued' | 'Cancelled';
  subtotal: number;
  taxAmount: number;
  total: number;
  payments: Payment[];
  amountPaid: number;
  balance: number;
  paymentStatus: 'Unpaid' | 'Partially paid' | 'Paid';
  createdAt: string;
}

export type InvoiceInput = Partial<
  Omit<Invoice, '_id' | 'invoiceNumber' | 'payments' | 'subtotal' | 'taxAmount' | 'total' | 'amountPaid' | 'balance' | 'paymentStatus' | 'createdAt'>
>;

export interface PaymentInput {
  date: string;
  amount: number;
  paidBy: string;
  method: string;
  transactionId?: string;
  // The payment type (full / advance / partial / final) is set by the server.
  note?: string;
}

export const invoiceService = {
  list: async (params?: { search?: string; booking?: string; page?: number; limit?: number }) => {
    const response = await axiosInstance.get('/invoices', { params });
    return response.data.data as {
      invoices: Invoice[];
      pagination: { total: number; page: number; pages: number };
    };
  },

  get: async (id: string) => {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data.data.invoice as Invoice;
  },

  create: async (data: InvoiceInput) => {
    const response = await axiosInstance.post('/invoices', data);
    return response.data.data.invoice as Invoice;
  },

  update: async (id: string, data: InvoiceInput) => {
    const response = await axiosInstance.patch(`/invoices/${id}`, data);
    return response.data.data.invoice as Invoice;
  },

  remove: async (id: string) => {
    await axiosInstance.delete(`/invoices/${id}`);
  },

  addPayment: async (id: string, data: PaymentInput) => {
    const response = await axiosInstance.post(`/invoices/${id}/payments`, data);
    return response.data.data as { invoice: Invoice; payment: Payment };
  },

  removePayment: async (id: string, paymentId: string) => {
    const response = await axiosInstance.delete(`/invoices/${id}/payments/${paymentId}`);
    return response.data.data.invoice as Invoice;
  },
};
