// routes/invoice.routes.ts
import express from 'express';
import {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment,
  deletePayment,
} from '../controllers/invoice.controller';
import { protect } from '../controllers/auth.controller';

const router = express.Router();

// Invoices and receipts are admin only.
router.use(protect);

router.get('/', getAllInvoices);
router.post('/', createInvoice);

router.get('/:id', getInvoice);
router.patch('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

router.post('/:id/payments', addPayment);
router.delete('/:id/payments/:paymentId', deletePayment);

export default router;
