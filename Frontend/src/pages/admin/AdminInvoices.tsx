// src/pages/admin/AdminInvoices.tsx
//
// Invoices and payment receipts. An invoice can be started from a website
// booking (Bookings → "Create invoice", which lands here with ?booking=<id>)
// or from scratch for bookings taken by phone / WhatsApp. Every payment
// recorded against an invoice gets its own receipt number and printable receipt.
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Receipt,
  Pencil,
  Trash2,
  Wallet,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { AdminPagination, ADMIN_PAGE_SIZE } from "@/components/admin/AdminPagination";
import { BookingPicker, type PickedBooking } from "@/components/admin/BookingPicker";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import axiosInstance from "@/lib/axios";
import { BOOKING_CURRENCY, TAX_LABEL, formatDocDate, formatMoney, toDateInput } from "@/lib/invoice";
import {
  invoiceService,
  INVOICE_CURRENCIES,
  PAYMENT_METHODS,
  type Invoice,
  type InvoiceCurrency,
} from "@/services/invoices";

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const STATUS_STYLES: Record<Invoice["paymentStatus"] | "Cancelled", string> = {
  Paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  "Partially paid": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Unpaid: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
  Cancelled: "bg-muted text-muted-foreground",
};

function StatusPill({ invoice }: { invoice: Invoice }) {
  const label = invoice.status === "Cancelled" ? "Cancelled" : invoice.paymentStatus;
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap", STATUS_STYLES[label])}>
      {label}
    </span>
  );
}

const openInNewTab = (path: string) => window.open(path, "_blank", "noopener");

/** Suggestions for the payment method inputs (any other method can be typed). */
const PaymentMethodOptions = () => (
  <datalist id="payment-methods">
    {PAYMENT_METHODS.map((m) => (
      <option key={m} value={m} />
    ))}
  </datalist>
);

/** What the server will record the payment as, shown before saving. */
const paymentTypeLabel = (invoice: Invoice, amount: number) => {
  const clears = amount >= invoice.balance - 0.005;
  if (invoice.payments.length === 0) return clears ? "Full payment" : "Advance payment";
  return clears ? "Final payment" : "Partial payment";
};

/* ------------------------------------------------------------------ */
/* Invoice form                                                        */
/* ------------------------------------------------------------------ */

interface ItemRow {
  description: string;
  quantity: string;
  unitPrice: string;
}

interface InvoiceFormState {
  booking?: string;
  // Display only – always taken from the linked booking.
  bookingRef: string;
  issueDate: string;
  dueDate: string;
  currency: InvoiceCurrency;
  client: { name: string; address: string; country: string; nationality: string; phone: string; email: string };
  packageName: string;
  travelDate: string;
  travellers: string;
  items: ItemRow[];
  discount: string;
  taxPercent: string;
  notes: string;
  status: Invoice["status"];
}

const DEFAULT_NOTES = "Please quote the invoice number when making the payment.";

const emptyInvoiceForm = (): InvoiceFormState => ({
  bookingRef: "",
  issueDate: toDateInput(new Date()),
  dueDate: "",
  currency: "USD",
  client: { name: "", address: "", country: "", nationality: "", phone: "", email: "" },
  packageName: "",
  travelDate: "",
  travellers: "",
  items: [{ description: "", quantity: "1", unitPrice: "" }],
  discount: "",
  taxPercent: "",
  notes: DEFAULT_NOTES,
  status: "Issued",
});

const formFromInvoice = (invoice: Invoice): InvoiceFormState => ({
  booking: invoice.booking,
  bookingRef: invoice.bookingRef || "",
  issueDate: toDateInput(invoice.issueDate),
  dueDate: toDateInput(invoice.dueDate),
  currency: invoice.currency,
  client: {
    name: invoice.client.name || "",
    address: invoice.client.address || "",
    country: invoice.client.country || "",
    nationality: invoice.client.nationality || "",
    phone: invoice.client.phone || "",
    email: invoice.client.email || "",
  },
  packageName: invoice.packageName || "",
  travelDate: invoice.travelDate || "",
  travellers: invoice.travellers ? String(invoice.travellers) : "",
  items: invoice.items.map((item) => ({
    description: item.description,
    quantity: String(item.quantity),
    unitPrice: String(item.unitPrice),
  })),
  discount: invoice.discount ? String(invoice.discount) : "",
  taxPercent: invoice.taxPercent ? String(invoice.taxPercent) : "",
  notes: invoice.notes || "",
  status: invoice.status,
});

// Fills the client, trip and price from a booking, keeping what the admin
// already typed for anything the booking doesn't have (address, notes, dates).
// Website bookings are priced in BOOKING_CURRENCY; the admin can switch currency and prices.
const formFromBooking = (booking: PickedBooking, base: InvoiceFormState = emptyInvoiceForm()): InvoiceFormState => {
  const travellers = Number(booking.travelers) || 1;
  const perPerson = booking.selectedPrice || (booking.totalAmount ? booking.totalAmount / travellers : 0);
  return {
    ...base,
    booking: booking._id,
    bookingRef: booking.bookingId || "",
    currency: BOOKING_CURRENCY,
    client: { ...base.client, name: booking.customerName || "", phone: booking.phone || "", email: booking.email || "" },
    packageName: booking.tripName || "",
    travelDate: booking.selectedDate || "",
    travellers: String(travellers),
    items: [{ description: booking.tripName || "Tour package", quantity: String(travellers), unitPrice: String(perPerson || "") }],
  };
};

/** Everything the customer filled in on the website, for the admin to check. */
function BookingSummary({ booking }: { booking: PickedBooking }) {
  const rows: [string, string | number | undefined][] = [
    ["Name", booking.customerName],
    ["Email", booking.email],
    ["Phone", booking.phone],
    ["WhatsApp", booking.whatsapp],
    ["Trip", booking.tripName],
    ["Travellers", booking.travelers],
    ["Travel date", booking.selectedDate],
    ["Pick-up location", booking.pickupLocation],
    ["Meditation required", booking.meditationRequired === undefined ? undefined : booking.meditationRequired ? "Yes" : "No"],
    ["Website total", formatPrice(booking.totalAmount || 0, BOOKING_CURRENCY)],
    ["Booked on", formatDocDate(booking.createdAt)],
    ["Status", booking.status],
  ];
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
      <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {rows
          .filter(([, value]) => value !== undefined && value !== "")
          .map(([label, value]) => (
            <div key={label} className="flex gap-2 min-w-0">
              <dt className="shrink-0 text-muted-foreground">{label}:</dt>
              <dd className="font-medium break-words min-w-0">{value}</dd>
            </div>
          ))}
      </dl>
      {booking.message && (
        <p className="mt-2 border-t border-border pt-2 whitespace-pre-wrap break-words">
          <span className="text-muted-foreground">Message: </span>
          {booking.message}
        </p>
      )}
    </div>
  );
}

const num = (value: string) => (value.trim() === "" ? 0 : Number(value));

function formTotals(form: InvoiceFormState) {
  const subtotal = form.items.reduce((sum, item) => sum + num(item.quantity) * num(item.unitPrice), 0);
  const taxable = Math.max(0, subtotal - num(form.discount));
  const tax = (taxable * num(form.taxPercent)) / 100;
  return { subtotal, tax, total: taxable + tax };
}

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

const emptyPayNow = () => ({
  enabled: false,
  amount: "",
  date: toDateInput(new Date()),
  method: PAYMENT_METHODS[0],
  transactionId: "",
});

function InvoiceFormDialog({
  open,
  initial,
  initialBooking,
  editing,
  onClose,
  onSaved,
  onOpenExisting,
}: {
  open: boolean;
  initial: InvoiceFormState;
  initialBooking?: PickedBooking | null;
  editing?: Invoice | null;
  onClose: () => void;
  onSaved: (invoice: Invoice) => void;
  onOpenExisting: (invoice: Invoice) => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [linked, setLinked] = useState<PickedBooking | null>(null);
  const [picking, setPicking] = useState(false);
  // Another invoice already made for the chosen booking.
  const [duplicate, setDuplicate] = useState<Invoice | null>(null);
  const [payNow, setPayNow] = useState(emptyPayNow);

  useEffect(() => {
    if (!open) return;
    setForm(initial);
    setLinked(initialBooking || null);
    setPicking(false);
    setDuplicate(null);
    setPayNow(emptyPayNow());
    // Editing an invoice linked to a booking: load the booking to show its details.
    if (initial.booking && !initialBooking) {
      axiosInstance
        .get(`/bookings/${initial.booking}`)
        .then((response) => setLinked(response.data?.data?.booking || null))
        .catch(() => setLinked(null));
    }
  }, [open, initial, initialBooking]);

  const handlePickBooking = async (booking: PickedBooking) => {
    setLinked(booking);
    setPicking(false);
    setForm((prev) => formFromBooking(booking, prev));
    setDuplicate(null);
    try {
      const existing = await invoiceService.list({ booking: booking._id, limit: 5 });
      setDuplicate(existing.invoices.find((invoice) => invoice._id !== editing?._id) || null);
    } catch {
      // The check is only a convenience.
    }
  };

  const unlinkBooking = () => {
    setLinked(null);
    setDuplicate(null);
    setForm((prev) => ({ ...prev, booking: undefined, bookingRef: "" }));
  };

  const setClient = (key: keyof InvoiceFormState["client"], value: string) =>
    setForm((prev) => ({ ...prev, client: { ...prev.client, [key]: value } }));

  const setItem = (index: number, key: keyof ItemRow, value: string) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));

  const totals = formTotals(form);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const items = form.items.filter((item) => item.description.trim());
    if (!form.client.name.trim()) {
      toast({ title: "Client name is required", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Add at least one item with a description", variant: "destructive" });
      return;
    }

    const payNowAmount = num(payNow.amount || String(totals.total));
    if (payNow.enabled && (!(payNowAmount > 0) || payNowAmount > totals.total + 0.005)) {
      toast({ title: "Payment amount must be more than 0 and not more than the total", variant: "destructive" });
      return;
    }

    const payload = {
      // An empty value unlinks the booking on the server.
      booking: form.booking || "",
      issueDate: form.issueDate,
      dueDate: form.dueDate || undefined,
      currency: form.currency,
      client: form.client,
      packageName: form.packageName,
      travelDate: form.travelDate,
      travellers: form.travellers ? num(form.travellers) : undefined,
      items: items.map((item) => ({
        description: item.description.trim(),
        quantity: num(item.quantity),
        unitPrice: num(item.unitPrice),
      })),
      discount: num(form.discount),
      taxPercent: num(form.taxPercent),
      notes: form.notes,
      status: form.status,
    };

    try {
      setSaving(true);
      let saved = editing ? await invoiceService.update(editing._id, payload) : await invoiceService.create(payload);
      if (!editing && payNow.enabled) {
        try {
          const result = await invoiceService.addPayment(saved._id, {
            date: payNow.date,
            amount: payNowAmount,
            paidBy: form.client.name,
            method: payNow.method,
            transactionId: payNow.transactionId,
          });
          saved = result.invoice;
          toast({ title: `Invoice ${saved.invoiceNumber} and receipt ${result.payment.receiptNumber} created` });
        } catch (error: any) {
          // The invoice exists; the payment can be recorded again from its details.
          toast({
            title: `Invoice ${saved.invoiceNumber} created, but the payment was not saved`,
            description: error.response?.data?.message || "Use Record payment to add it.",
            variant: "destructive",
          });
        }
      } else {
        toast({ title: editing ? "Invoice updated" : `Invoice ${saved.invoiceNumber} created` });
      }
      onSaved(saved);
    } catch (error: any) {
      toast({
        title: "Could not save invoice",
        description: error.response?.data?.message || "Please check the details and try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && !saving && onClose()}>
      <DialogContent className="max-w-3xl max-h-[92svh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit ${editing.invoiceNumber}` : "New invoice"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Invoice and receipt numbers never change once given."
              : "Invoice and receipt numbers are given automatically when you save."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Website booking {form.bookingRef && <span className="normal-case">· {form.bookingRef}</span>}
              </h3>
              {form.booking && !picking && (
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setPicking(true)}>
                    Change
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={unlinkBooking}>
                    Remove link
                  </Button>
                </div>
              )}
            </div>
            {!form.booking || picking ? (
              <>
                <BookingPicker onSelect={handlePickBooking} />
                <p className="text-xs text-muted-foreground">
                  Choose the booking to fill in the client and trip automatically, or leave this empty and type the
                  details for bookings taken by phone or WhatsApp.
                </p>
              </>
            ) : linked ? (
              <>
                <BookingSummary booking={linked} />
                <p className="text-xs text-muted-foreground">
                  Website prices are in {BOOKING_CURRENCY}. Change the currency and rates below if you bill in another currency.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Linked to booking {form.bookingRef}.</p>
            )}
            {duplicate && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                <span className="flex-1">
                  This booking already has invoice <strong>{duplicate.invoiceNumber}</strong>. Record further payments
                  on that invoice instead of making a new one.
                </span>
                <Button type="button" size="sm" variant="outline" onClick={() => onOpenExisting(duplicate)}>
                  Open {duplicate.invoiceNumber}
                </Button>
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Client</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="Client name *">
                <Input value={form.client.name} onChange={(e) => setClient("name", e.target.value)} required />
              </FormField>
              <FormField label="Address">
                <Input value={form.client.address} onChange={(e) => setClient("address", e.target.value)} />
              </FormField>
              <FormField label="Country">
                <Input value={form.client.country} onChange={(e) => setClient("country", e.target.value)} />
              </FormField>
              <FormField label="Nationality">
                <Input value={form.client.nationality} onChange={(e) => setClient("nationality", e.target.value)} />
              </FormField>
              <FormField label="Contact phone">
                <Input value={form.client.phone} onChange={(e) => setClient("phone", e.target.value)} />
              </FormField>
              <FormField label="Contact email">
                <Input type="email" value={form.client.email} onChange={(e) => setClient("email", e.target.value)} />
              </FormField>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trip &amp; invoice</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Package" className="sm:col-span-2 lg:col-span-1">
                <Input value={form.packageName} onChange={(e) => setForm({ ...form, packageName: e.target.value })} />
              </FormField>
              <FormField label="Travel date">
                <Input value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} placeholder="e.g. 12–22 Nov 2026" />
              </FormField>
              <FormField label="Travellers">
                <Input type="number" min={0} value={form.travellers} onChange={(e) => setForm({ ...form, travellers: e.target.value })} />
              </FormField>
              <FormField label="Invoice date">
                <Input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} required />
              </FormField>
              <FormField label="Due date">
                <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </FormField>
              <FormField label="Currency">
                <select
                  className={selectClassName}
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value as InvoiceCurrency })}
                >
                  {INVOICE_CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>
              {editing && (
                <FormField label="Status">
                  <select
                    className={selectClassName}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Invoice["status"] })}
                  >
                    <option value="Issued">Issued</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </FormField>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</h3>
            <div className="space-y-2">
              {form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-border p-2 sm:grid-cols-[1fr_5rem_8rem_auto] sm:border-0 sm:p-0">
                  <Input
                    className="col-span-2 sm:col-span-1"
                    placeholder="Description (e.g. 11 Days Bhutan Trip – per person)"
                    value={item.description}
                    onChange={(e) => setItem(index, "description", e.target.value)}
                  />
                  <div className="col-span-2 grid grid-cols-2 gap-2 sm:contents">
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder="Qty"
                      aria-label="Quantity"
                      value={item.quantity}
                      onChange={(e) => setItem(index, "quantity", e.target.value)}
                    />
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      placeholder={`Rate (${form.currency})`}
                      aria-label="Rate"
                      value={item.unitPrice}
                      onChange={(e) => setItem(index, "unitPrice", e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="row-start-1 col-start-2 sm:row-auto sm:col-auto"
                    aria-label="Remove item"
                    disabled={form.items.length === 1}
                    onClick={() => setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }))}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setForm((prev) => ({ ...prev, items: [...prev.items, { description: "", quantity: "1", unitPrice: "" }] }))}
            >
              <Plus />
              Add item
            </Button>

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label={`Discount (${form.currency})`}>
                <Input type="number" min={0} step="any" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
              </FormField>
              <FormField label={TAX_LABEL}>
                <Input type="number" min={0} max={100} step="any" value={form.taxPercent} onChange={(e) => setForm({ ...form, taxPercent: e.target.value })} />
              </FormField>
            </div>

            <dl className="ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatMoney(totals.subtotal, form.currency)}</dd>
              </div>
              {totals.tax > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="tabular-nums">{formatMoney(totals.tax, form.currency)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-1 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatMoney(totals.total, form.currency)}</dd>
              </div>
            </dl>
          </section>

          <FormField label="Notes & payment terms (printed on the invoice)">
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </FormField>

          {!editing && (
            <section className="space-y-3 rounded-lg border border-border p-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={payNow.enabled}
                  onChange={(e) => setPayNow({ ...payNow, enabled: e.target.checked })}
                />
                <span className="text-sm font-medium">Payment already received – create the receipt now</span>
              </label>
              {payNow.enabled && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label={`Amount received (${form.currency})`}>
                    <Input
                      type="number"
                      min={0.01}
                      step="any"
                      placeholder={String(totals.total)}
                      value={payNow.amount}
                      onChange={(e) => setPayNow({ ...payNow, amount: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Payment date">
                    <Input type="date" value={payNow.date} onChange={(e) => setPayNow({ ...payNow, date: e.target.value })} required />
                  </FormField>
                  <FormField label="Method">
                    <Input
                      list="payment-methods"
                      value={payNow.method}
                      onChange={(e) => setPayNow({ ...payNow, method: e.target.value })}
                      required
                    />
                  </FormField>
                  <FormField label="Bank / card transaction ID">
                    <Input
                      value={payNow.transactionId}
                      onChange={(e) => setPayNow({ ...payNow, transactionId: e.target.value })}
                      placeholder="From the bank or payment slip"
                    />
                  </FormField>
                  <p className="text-xs text-muted-foreground sm:col-span-2">
                    Leave the amount empty to receive the full total. Paid by is the client name; the payment type
                    (full / advance) is set automatically.
                  </p>
                </div>
              )}
            </section>
          )}
          <PaymentMethodOptions />

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {editing ? "Save changes" : "Create invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Payment form                                                        */
/* ------------------------------------------------------------------ */

function PaymentDialog({
  invoice,
  onClose,
  onSaved,
}: {
  invoice: Invoice | null;
  onClose: () => void;
  onSaved: (invoice: Invoice) => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: "",
    amount: "",
    paidBy: "",
    method: PAYMENT_METHODS[0],
    transactionId: "",
    note: "",
  });

  useEffect(() => {
    if (!invoice) return;
    setForm({
      date: toDateInput(new Date()),
      amount: String(invoice.balance),
      paidBy: invoice.client.name,
      // Reuse the method from the last payment, e.g. the advance and the balance by wire.
      method: invoice.payments[invoice.payments.length - 1]?.method || PAYMENT_METHODS[0],
      transactionId: "",
      note: "",
    });
  }, [invoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    try {
      setSaving(true);
      const result = await invoiceService.addPayment(invoice._id, { ...form, amount: Number(form.amount) });
      toast({ title: `Receipt ${result.payment.receiptNumber} created` });
      onSaved(result.invoice);
    } catch (error: any) {
      toast({
        title: "Could not record payment",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(invoice)} onOpenChange={(value) => !value && !saving && onClose()}>
      <DialogContent className="max-w-lg max-h-[92svh] overflow-y-auto">
        {invoice && (
          <>
            <DialogHeader>
              <DialogTitle>Record payment</DialogTitle>
              <DialogDescription>
                {invoice.invoiceNumber} · {invoice.client.name} · balance {formatMoney(invoice.balance, invoice.currency)}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField label="Payment date *">
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </FormField>
                <FormField label={`Amount (${invoice.currency}) *`}>
                  <Input
                    type="number"
                    min={0.01}
                    max={invoice.balance}
                    step="any"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </FormField>
                <FormField label="Paid by *">
                  <Input value={form.paidBy} onChange={(e) => setForm({ ...form, paidBy: e.target.value })} required />
                </FormField>
                <FormField label="Method *">
                  <Input
                    list="payment-methods"
                    value={form.method}
                    onChange={(e) => setForm({ ...form, method: e.target.value })}
                    required
                  />
                  <PaymentMethodOptions />
                </FormField>
                <FormField label="Bank / card transaction ID" className="sm:col-span-2">
                  <Input
                    value={form.transactionId}
                    onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                    placeholder="From the bank or payment slip"
                  />
                </FormField>
              </div>
              <p className="text-xs text-muted-foreground">
                Recorded as <strong>{paymentTypeLabel(invoice, Number(form.amount) || 0)}</strong> · receipt number is
                given automatically.
              </p>
              <FormField label="Note (optional, printed on the receipt)">
                <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
              </FormField>
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="animate-spin" />}
                  Save &amp; create receipt
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AdminInvoices() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<InvoiceFormState>(emptyInvoiceForm);
  const [formBooking, setFormBooking] = useState<PickedBooking | null>(null);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [viewing, setViewing] = useState<Invoice | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, searchQuery]);

  // Arriving from Bookings → "Create invoice": open the booking's invoice if it
  // already has one, otherwise start a new invoice filled in from the booking.
  useEffect(() => {
    const bookingId = searchParams.get("booking");
    if (!bookingId) return;
    setSearchParams({}, { replace: true });
    (async () => {
      try {
        const existing = await invoiceService.list({ booking: bookingId, limit: 1 });
        if (existing.invoices[0]) {
          setViewing(existing.invoices[0]);
          return;
        }
        const response = await axiosInstance.get(`/bookings/${bookingId}`);
        const booking = response.data?.data?.booking as PickedBooking | undefined;
        if (!booking) throw new Error("Booking not found");
        openCreate(formFromBooking(booking), booking);
      } catch (error: any) {
        toast({
          title: "Could not load booking",
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      }
    })();
  }, [searchParams]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.list({ page: currentPage, limit: ADMIN_PAGE_SIZE, search: searchQuery });
      setInvoices(data.invoices);
      setTotalPages(data.pagination.pages || 1);
      setTotalItems(data.pagination.total);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch invoices",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const openCreate = (initial: InvoiceFormState = emptyInvoiceForm(), booking: PickedBooking | null = null) => {
    setEditing(null);
    setFormInitial(initial);
    setFormBooking(booking);
    setFormOpen(true);
  };

  const openEdit = (invoice: Invoice) => {
    setViewing(null);
    setEditing(invoice);
    setFormInitial(formFromInvoice(invoice));
    setFormBooking(null);
    setFormOpen(true);
  };

  // Keep the list and any open detail view in step with the latest copy.
  const replaceInvoice = (invoice: Invoice) => {
    setInvoices((prev) => {
      const found = prev.some((i) => i._id === invoice._id);
      return found ? prev.map((i) => (i._id === invoice._id ? invoice : i)) : [invoice, ...prev];
    });
    setViewing((prev) => (prev && prev._id === invoice._id ? invoice : prev));
  };

  const handleDelete = async (invoice: Invoice) => {
    const receipts = invoice.payments.length;
    const warning = receipts
      ? `Delete ${invoice.invoiceNumber} and its ${receipts} receipt${receipts === 1 ? "" : "s"}? This cannot be undone.`
      : `Delete ${invoice.invoiceNumber}? This cannot be undone.`;
    if (!window.confirm(warning)) return;
    try {
      await invoiceService.remove(invoice._id);
      toast({ title: `${invoice.invoiceNumber} deleted` });
      setViewing(null);
      fetchInvoices();
    } catch (error: any) {
      toast({ title: "Delete failed", description: error.response?.data?.message, variant: "destructive" });
    }
  };

  const handleDeletePayment = async (invoice: Invoice, paymentId: string, receiptNumber: string) => {
    if (!window.confirm(`Remove payment ${receiptNumber}? Its receipt will no longer be available.`)) return;
    try {
      replaceInvoice(await invoiceService.removePayment(invoice._id, paymentId));
      toast({ title: `${receiptNumber} removed` });
    } catch (error: any) {
      toast({ title: "Could not remove payment", description: error.response?.data?.message, variant: "destructive" });
    }
  };

  const rowActions = (invoice: Invoice) => (
    <>
      <Button variant="outline" size="sm" onClick={() => openInNewTab(`/admin/invoices/${invoice._id}/print`)}>
        <FileText />
        Invoice PDF
      </Button>
      {invoice.status !== "Cancelled" && invoice.balance > 0 && (
        <Button variant="outline" size="sm" onClick={() => setPaying(invoice)}>
          <Wallet />
          Record payment
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={() => setViewing(invoice)}>
        Details
      </Button>
    </>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold">Invoices &amp; Receipts</h1>
            <p className="text-sm text-muted-foreground">
              Create invoices, record payments and download receipts as PDF.
            </p>
          </div>
          <Button onClick={() => openCreate()}>
            <Plus />
            New invoice
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search invoice / receipt no., client, package..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading && invoices.length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : invoices.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              <Receipt className="mx-auto mb-3 h-8 w-8" />
              {searchQuery ? "No invoices match your search." : "No invoices yet. Create one here or from a booking."}
            </div>
          ) : (
            <ul className={cn("divide-y divide-border", loading && "opacity-60")}>
              {invoices.map((invoice) => (
                <li key={invoice._id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{invoice.invoiceNumber}</span>
                      <StatusPill invoice={invoice} />
                      {invoice.bookingRef && (
                        <span className="text-xs text-muted-foreground">Booking {invoice.bookingRef}</span>
                      )}
                    </div>
                    <p className="truncate text-sm">
                      {invoice.client.name}
                      {invoice.packageName && <span className="text-muted-foreground"> · {invoice.packageName}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDocDate(invoice.issueDate)}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm lg:w-80">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-semibold tabular-nums">{formatMoney(invoice.total, invoice.currency)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <p className="tabular-nums">{formatMoney(invoice.amountPaid, invoice.currency)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="tabular-nums">{formatMoney(invoice.balance, invoice.currency)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">{rowActions(invoice)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <AdminPagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemLabel="invoices"
          onPageChange={setCurrentPage}
          disabled={loading}
        />
      </div>

      <InvoiceFormDialog
        open={formOpen}
        initial={formInitial}
        initialBooking={formBooking}
        editing={editing}
        onClose={() => setFormOpen(false)}
        onOpenExisting={(invoice) => {
          setFormOpen(false);
          setViewing(invoice);
        }}
        onSaved={(invoice) => {
          setFormOpen(false);
          replaceInvoice(invoice);
          if (!editing) setViewing(invoice);
        }}
      />

      <PaymentDialog
        invoice={paying}
        onClose={() => setPaying(null)}
        onSaved={(invoice) => {
          // Show the details view, where the new receipt's PDF button is one click
          // away (opening a tab here, after an await, gets popup-blocked).
          setPaying(null);
          replaceInvoice(invoice);
          setViewing(invoice);
        }}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={(value) => !value && setViewing(null)}>
        <DialogContent className="max-w-xl max-h-[92svh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {viewing.invoiceNumber}
                  <StatusPill invoice={viewing} />
                </DialogTitle>
                <DialogDescription>
                  {viewing.client.name}
                  {viewing.packageName && ` · ${viewing.packageName}`} · issued {formatDocDate(viewing.issueDate)}
                </DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-3 gap-3 rounded-lg bg-muted p-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-semibold tabular-nums">{formatMoney(viewing.total, viewing.currency)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Paid</dt>
                  <dd className="tabular-nums">{formatMoney(viewing.amountPaid, viewing.currency)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Balance</dt>
                  <dd className="tabular-nums">{formatMoney(viewing.balance, viewing.currency)}</dd>
                </div>
              </dl>

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Payments &amp; receipts
                </h3>
                {viewing.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                ) : (
                  <ul className="divide-y divide-border rounded-lg border border-border">
                    {viewing.payments.map((payment) => (
                      <li key={payment._id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{payment.receiptNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDocDate(payment.date)} · {payment.method} · {payment.paymentType}
                          </p>
                        </div>
                        <span className="font-semibold tabular-nums">{formatMoney(payment.amount, viewing.currency)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInNewTab(`/admin/invoices/${viewing._id}/receipts/${payment._id}`)}
                        >
                          <Receipt />
                          Receipt PDF
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${payment.receiptNumber}`}
                          onClick={() => handleDeletePayment(viewing, payment._id, payment.receiptNumber)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => openInNewTab(`/admin/invoices/${viewing._id}/print`)}>
                  <ExternalLink />
                  Invoice PDF
                </Button>
                {viewing.status !== "Cancelled" && viewing.balance > 0 && (
                  <Button size="sm" onClick={() => setPaying(viewing)}>
                    <Wallet />
                    Record payment
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => openEdit(viewing)}>
                  <Pencil />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="ml-auto text-destructive" onClick={() => handleDelete(viewing)}>
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
