// src/pages/admin/InvoiceDocument.tsx
//
// Printable A4 invoice (/admin/invoices/:id/print) and payment receipt
// (/admin/invoices/:id/receipts/:paymentId). "Download PDF" opens the browser's
// print dialog, where "Save as PDF" produces the file to send to the client.
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invoiceService, type Invoice, type Payment } from "@/services/invoices";
import { COMPANY, formatDocDate, formatMoney } from "@/lib/invoice";

// Company-specific details (colour, stamp, offices...) all live in COMPANY.
const GREEN = COMPANY.brandColor;

const styles = `
.doc-page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; color: #1f2937;
  font-family: "DejaVu Sans", "Segoe UI", Helvetica, Arial, sans-serif; font-size: 10.5pt; line-height: 1.4;
  display: flex; flex-direction: column; border-top: 6px solid ${GREEN}; padding: 14mm 14mm 8mm; box-sizing: border-box;
  position: relative; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.doc-page * { box-sizing: border-box; }
.doc-muted { color: #6b7280; }
.doc-label { font-size: 8.5pt; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; color: #6b7280; }
.doc-rule { border-top: 1.5px solid ${GREEN}; }
.doc-rule-bottom { border-bottom: 1.5px solid ${GREEN}; }
.doc-kv { display: grid; grid-template-columns: auto 1fr; column-gap: 24px; }
.doc-kv dd { text-align: right; font-weight: 700; margin: 0; }
.doc-table { width: 100%; border-collapse: collapse; }
.doc-table th { background: ${GREEN}; color: #fff; font-size: 9pt; text-align: left; padding: 7px 10px; }
.doc-table td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
.doc-num { text-align: right !important; white-space: nowrap; font-variant-numeric: tabular-nums; }
.doc-bar { background: ${GREEN}; color: #fff; display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; }
.doc-sum td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
.doc-sum tr.doc-hl td { background: #d1fae5; font-weight: 700; border-bottom: 0; }
.doc-box { background: #f3f4f6; border: 1px solid #e5e7eb; padding: 10px 12px; }
.doc-watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;
  font-size: 90pt; font-weight: 800; color: rgba(220, 38, 38, .12); transform: rotate(-30deg); }
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; }
  .no-print { display: none !important; }
  .doc-shell { padding: 0 !important; background: #fff !important; }
  .doc-page { box-shadow: none !important; margin: 0; }
}
`;

function Field({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <span className="doc-muted">{label}: </span>
      {value}
    </div>
  );
}

function Header({ title, meta }: { title: string; meta: [string, string | undefined][] }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 24, paddingBottom: 10 }} className="doc-rule-bottom">
      <div>
        <img src={COMPANY.logo} alt="" style={{ width: COMPANY.logoWidth, height: "auto", marginBottom: 8 }} />
        <div style={{ color: GREEN, fontSize: "15pt", fontWeight: 700 }}>{COMPANY.name}</div>
        <div style={{ fontSize: "9pt", fontWeight: 700 }} className="doc-muted">{COMPANY.officeLabel}</div>
        <div style={{ fontSize: "9pt" }} className="doc-muted">
          {COMPANY.address}
          <br />
          {COMPANY.phone} · {COMPANY.email}
          <br />
          {COMPANY.website}
          {COMPANY.state && (
            <>
              <br />
              State: {COMPANY.state}
            </>
          )}
          {COMPANY.taxId && (
            <>
              <br />
              {COMPANY.taxId}
            </>
          )}
        </div>
      </div>
      <div style={{ minWidth: "48%" }}>
        <div style={{ color: GREEN, fontSize: "19pt", fontWeight: 800, textAlign: "right", marginBottom: 6 }}>{title}</div>
        <dl className="doc-kv" style={{ margin: 0 }}>
          {meta
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt className="doc-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  );
}

function Signature() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 36, breakInside: "avoid" }}>
      <div style={{ width: "34%" }}>
        <div>
          For <strong>{COMPANY.name}</strong>
        </div>
        <div style={{ position: "relative", height: COMPANY.stamp ? 110 : 90 }}>
          <img
            src={COMPANY.signature}
            alt=""
            style={{ position: "absolute", left: 0, bottom: 4, width: COMPANY.stamp ? 160 : 170 }}
          />
          {COMPANY.stamp && (
            <img
              src={COMPANY.stamp}
              alt=""
              style={{ position: "absolute", right: 0, top: 14, width: 104, mixBlendMode: "multiply" }}
            />
          )}
        </div>
        <div style={{ borderTop: "1px solid #9ca3af", paddingTop: 4 }}>
          <strong>{COMPANY.signatory}</strong>
          <div className="doc-muted">{COMPANY.signatoryTitle}</div>
        </div>
      </div>
    </div>
  );
}

function Footer({ docLabel }: { docLabel: string }) {
  return (
    <div style={{ marginTop: "auto", paddingTop: 16, fontSize: "8pt" }} className="doc-muted">
      {COMPANY.offices && <div style={{ textAlign: "center", marginBottom: 4 }}>Our offices: {COMPANY.offices}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 4 }}>
        <div>
          {COMPANY.name} · {COMPANY.phone} · {COMPANY.email}
          <br />
          {COMPANY.website}
        </div>
        <div style={{ alignSelf: "center" }}>{docLabel} &nbsp; Page 1 of 1</div>
      </div>
    </div>
  );
}

function ClientBlock({ invoice, title }: { invoice: Invoice; title: string }) {
  const c = invoice.client;
  return (
    <div>
      <div className="doc-rule" style={{ paddingTop: 8 }} />
      <div className="doc-label" style={{ marginBottom: 4 }}>{title}</div>
      <div style={{ fontWeight: 700 }}>{c.name}</div>
      <Field label="Address" value={c.address} />
      <Field label="Country" value={c.country} />
      <Field label="Nationality" value={c.nationality} />
      <Field label="Contact phone" value={c.phone} />
      <Field label="Contact email" value={c.email} />
    </div>
  );
}

function InvoiceBody({ invoice }: { invoice: Invoice }) {
  const cur = invoice.currency;
  return (
    <>
      <Header
        title="INVOICE"
        meta={[
          ["Invoice No.", invoice.invoiceNumber],
          ["Invoice date", formatDocDate(invoice.issueDate)],
          ["Due date", formatDocDate(invoice.dueDate)],
          ["Currency", cur],
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 }}>
        <ClientBlock invoice={invoice} title="Bill to" />
        <div>
          <div className="doc-rule" style={{ paddingTop: 8 }} />
          <div className="doc-label" style={{ marginBottom: 4 }}>Trip details</div>
          <Field label="Package" value={invoice.packageName} />
          <Field label="Travel date" value={invoice.travelDate} />
          <Field label="Travellers" value={invoice.travellers} />
          <Field label="Booking ref" value={invoice.bookingRef} />
        </div>
      </div>

      <table className="doc-table" style={{ marginTop: 22 }}>
        <thead>
          <tr>
            <th style={{ width: 36 }}>#</th>
            <th>Description</th>
            <th className="doc-num">Qty</th>
            <th className="doc-num">Rate</th>
            <th className="doc-num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{item.description}</td>
              <td className="doc-num">{item.quantity}</td>
              <td className="doc-num">{formatMoney(item.unitPrice, cur)}</td>
              <td className="doc-num">{formatMoney(item.quantity * item.unitPrice, cur)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <table className="doc-sum" style={{ width: "53%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td className="doc-num">{formatMoney(invoice.subtotal, cur)}</td>
            </tr>
            {invoice.discount > 0 && (
              <tr>
                <td>Discount</td>
                <td className="doc-num">− {formatMoney(invoice.discount, cur)}</td>
              </tr>
            )}
            {invoice.taxPercent > 0 && (
              <tr>
                <td>Tax ({invoice.taxPercent}%)</td>
                <td className="doc-num">{formatMoney(invoice.taxAmount, cur)}</td>
              </tr>
            )}
            <tr>
              <td style={{ fontWeight: 700 }}>Invoice total</td>
              <td className="doc-num" style={{ fontWeight: 700 }}>{formatMoney(invoice.total, cur)}</td>
            </tr>
            <tr>
              <td>Amount paid</td>
              <td className="doc-num">{formatMoney(invoice.amountPaid, cur)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="doc-bar" style={{ marginTop: 14 }}>
        <span style={{ fontWeight: 700, fontSize: "10pt" }}>{invoice.balance > 0 ? "BALANCE DUE" : "PAID IN FULL"}</span>
        <span style={{ fontWeight: 800, fontSize: "17pt" }}>{formatMoney(Math.max(invoice.balance, 0), cur)}</span>
      </div>

      {invoice.payments.length > 0 && (
        <div style={{ marginTop: 18, breakInside: "avoid" }}>
          <div className="doc-label" style={{ marginBottom: 4 }}>Payments received</div>
          <table className="doc-sum" style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5pt" }}>
            <tbody>
              {invoice.payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.receiptNumber}</td>
                  <td>{formatDocDate(p.date)}</td>
                  <td>{p.method}</td>
                  <td className="doc-num">{formatMoney(p.amount, cur)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {invoice.notes && (
        <div className="doc-box" style={{ marginTop: 18 }}>
          <div className="doc-label">Notes &amp; payment terms</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{invoice.notes}</div>
        </div>
      )}

      <Signature />
      <Footer docLabel={`Invoice ${invoice.invoiceNumber}`} />
    </>
  );
}

function ReceiptBody({ invoice, payment }: { invoice: Invoice; payment: Payment }) {
  const cur = invoice.currency;
  const index = invoice.payments.findIndex((p) => p._id === payment._id);
  const previous = invoice.payments.slice(0, index).reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(0, Math.round((invoice.total - previous - payment.amount) * 100) / 100);

  return (
    <>
      <Header
        title="PAYMENT RECEIPT"
        meta={[
          ["Receipt No.", payment.receiptNumber],
          ["Payment date", formatDocDate(payment.date)],
          ["Against invoice", invoice.invoiceNumber],
          ["Currency", cur],
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 18 }}>
        <ClientBlock invoice={invoice} title="Received from" />
        <div>
          <div className="doc-rule" style={{ paddingTop: 8 }} />
          <div className="doc-label" style={{ marginBottom: 4 }}>Payment details</div>
          <Field label="Paid by" value={payment.paidBy} />
          <Field label="Method" value={payment.method} />
          <Field label="Transaction ID" value={payment.transactionId} />
          <Field label="Payment type" value={payment.paymentType} />
          <Field label="Booking ref" value={invoice.bookingRef} />
          <Field label="Package" value={invoice.packageName} />
        </div>
      </div>

      <div className="doc-bar" style={{ marginTop: 22 }}>
        <span style={{ fontWeight: 700, fontSize: "10pt" }}>AMOUNT RECEIVED</span>
        <span style={{ fontWeight: 800, fontSize: "17pt" }}>{formatMoney(payment.amount, cur)}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <table className="doc-sum" style={{ width: "53%", borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td>Invoice total</td>
              <td className="doc-num">{formatMoney(invoice.total, cur)}</td>
            </tr>
            <tr>
              <td>Previous payments</td>
              <td className="doc-num">{formatMoney(previous, cur)}</td>
            </tr>
            <tr>
              <td>This payment</td>
              <td className="doc-num">{formatMoney(payment.amount, cur)}</td>
            </tr>
            <tr className="doc-hl">
              <td>Remaining balance</td>
              <td className="doc-num">{formatMoney(remaining, cur)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {payment.note && (
        <div style={{ marginTop: 12 }}>
          <span className="doc-muted">Note: </span>
          {payment.note}
        </div>
      )}

      <div className="doc-box" style={{ marginTop: 12 }}>
        <div className="doc-label">About this receipt</div>
        This receipt is issued by the company to acknowledge the payment recorded above against the invoice shown. It
        is not an invoice. Bank or card transaction records remain the proof of the transfer itself; the transaction
        reference is quoted for verification.
      </div>

      <Signature />
      <Footer docLabel={`Receipt ${payment.receiptNumber}`} />
    </>
  );
}

export default function InvoiceDocument() {
  const { id, paymentId } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    invoiceService
      .get(id)
      .then(setInvoice)
      .catch((err) => setError(err.response?.data?.message || "Could not load this invoice"));
  }, [id]);

  const payment = paymentId ? invoice?.payments.find((p) => p._id === paymentId) : undefined;
  const docNumber = paymentId ? payment?.receiptNumber : invoice?.invoiceNumber;

  // The browser uses the page title as the PDF file name: "TAN SU YIN RCT-2026-0002".
  useEffect(() => {
    if (!invoice || !docNumber) return;
    const previous = document.title;
    document.title = `${invoice.client.name} ${docNumber}`;
    return () => {
      document.title = previous;
    };
  }, [invoice, docNumber]);

  const notFound = invoice && paymentId && !payment;

  return (
    <div className="doc-shell min-h-screen bg-muted py-6 px-2 overflow-x-auto">
      <style>{styles}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/invoices">
            <ArrowLeft />
            Back to invoices
          </Link>
        </Button>
        {invoice && !notFound && (
          <Button size="sm" onClick={() => window.print()}>
            <Download />
            Download PDF / Print
          </Button>
        )}
      </div>

      {error || notFound ? (
        <p className="text-center text-destructive">{error || "This receipt no longer exists."}</p>
      ) : !invoice ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="doc-page shadow-lg">
          {invoice.status === "Cancelled" && <div className="doc-watermark">CANCELLED</div>}
          {payment ? <ReceiptBody invoice={invoice} payment={payment} /> : <InvoiceBody invoice={invoice} />}
        </div>
      )}
    </div>
  );
}
