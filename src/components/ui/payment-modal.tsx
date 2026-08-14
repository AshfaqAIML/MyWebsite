"use client";

import * as React from "react";
import { X, Download, Heart, Shield, Lock, CheckCircle, Clock, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  bookTitle: string;
  pdfUrl: string;
  pages?: number;
}

interface PaymentRecord {
  txnId: string;
  bookTitle: string;
  date: string;
  verified: boolean;
}

const UPI_ID = "mohdashfaq1416-1@okicici";
const ACCOUNT_NAME = "Ishfaq Dar";

function priceFromPages(pages?: number): number {
  if (!pages || pages <= 100) return 49;
  if (pages <= 200) return 79;
  if (pages <= 300) return 99;
  if (pages <= 400) return 149;
  return 199;
}

function getPayments(): PaymentRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("dashboard-payments");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function savePayments(payments: PaymentRecord[]) {
  localStorage.setItem("dashboard-payments", JSON.stringify(payments));
}

export function PaymentModal({ open, onClose, bookTitle, pdfUrl, pages }: PaymentModalProps) {
  const price = priceFromPages(pages);
  const paymentRef = React.useRef<HTMLDivElement>(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [pendingTxnId, setPendingTxnId] = React.useState("");
  const [submittedTxn, setSubmittedTxn] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const checkConfirmation = React.useCallback(() => {
    const payments = getPayments();
    const match = payments.find((p) => p.bookTitle === bookTitle);
    setConfirmed(match?.verified === true);
    if (match && match.verified && submittedTxn) setSubmittedTxn("");
  }, [bookTitle, submittedTxn]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      paymentRef.current?.focus();
      const t = setTimeout(() => checkConfirmation(), 0);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => {
        setPendingTxnId("");
        setSubmittedTxn("");
      }, 0);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, checkConfirmation]);

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const interval = setInterval(checkConfirmation, 3000);
    return () => clearInterval(interval);
  }, [open, checkConfirmation]);

  function handleSubmitVerification(e: React.FormEvent) {
    e.preventDefault();
    if (pendingTxnId.trim().length < 5) return;
    setSubmitting(true);
    const payments = getPayments();
    const existing = payments.findIndex((p) => p.bookTitle === bookTitle);
    const record: PaymentRecord = {
      txnId: pendingTxnId.trim(),
      bookTitle,
      date: new Date().toISOString(),
      verified: false,
    };
    if (existing >= 0) {
      payments[existing] = record;
    } else {
      payments.unshift(record);
    }
    savePayments(payments);
    setSubmittedTxn(pendingTxnId.trim());
    setPendingTxnId("");
    setSubmitting(false);
  }

  if (!open) return null;

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(ACCOUNT_NAME)}&am=${price}&cu=INR&tn=${encodeURIComponent(`Payment for: ${bookTitle}`)}`;
  const existingPayment = getPayments().find((p) => p.bookTitle === bookTitle);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div ref={paymentRef} tabIndex={-1} onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden outline-none">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10">
          <X className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </button>

        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-7 w-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Support My Work</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
            You&apos;re about to download <strong className="text-zinc-700 dark:text-zinc-300">{bookTitle}</strong>.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            Your contribution helps me create more quality content. Suggested contribution: <strong className="text-zinc-600 dark:text-zinc-400">₹{price}</strong>
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-5 mb-5">
            <Image src="/upi-qr.jpeg" alt="UPI QR Code"
              width={192} height={267}
              className="w-48 h-48 mx-auto rounded-xl shadow-sm object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }} />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-3 hidden">QR code not available. Use UPI ID below.</p>
            <div className="mt-3 text-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Or pay via UPI</p>
              <p className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 inline-block select-all">
                {UPI_ID}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mb-5">
            <a href={upiLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity">
              <Image src="https://img.icons8.com/color/20/google-pay-india.png" alt="" width={20} height={20} className="h-5 w-5" />
              Pay ₹{price} via UPI
            </a>
            {confirmed ? (
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
                <Download className="h-4 w-4" />
                Download PDF (Payment Confirmed ✓)
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm font-medium cursor-not-allowed select-none">
                <Lock className="h-4 w-4" />
                Download PDF after Payment
              </div>
            )}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-5">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Payment Verification</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              After making a UPI payment, enter your transaction ID to verify and unlock download access.
            </p>

            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 mb-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Pay via UPI</p>
              <p className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 inline-block select-all">
                {UPI_ID}
              </p>
            </div>

            {submittedTxn ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Verification submitted for transaction <strong>{submittedTxn}</strong>. The owner will confirm your payment shortly.
                  </p>
                  {!confirmed && (
                    <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Waiting for confirmation...
                    </p>
                  )}
                </div>
              </div>
            ) : existingPayment && !existingPayment.verified ? (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Your payment for <strong>{bookTitle}</strong> is pending verification. The owner will confirm it shortly.
                  </p>
                  <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Waiting for confirmation...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitVerification} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Book Purchased</label>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    {bookTitle}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">UPI Transaction ID</label>
                  <input type="text" value={pendingTxnId} onChange={(e) => setPendingTxnId(e.target.value)} required placeholder="e.g. UPI123456789"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
                </div>
                <button type="submit" disabled={pendingTxnId.trim().length < 5 || submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  Verify Payment
                </button>
              </form>
            )}

            {confirmed && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Payment confirmed! You can now download your book.
                </p>
              </div>
            )}
          </div>

          <a href="/dashboard/payments" target="_blank" rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            <ExternalLink className="h-3 w-3" />
            Manage payments in Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
