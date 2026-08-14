"use client";

import * as React from "react";
import { Shield, Download, CheckCircle, Clock, BookOpen, Search, FileText, CheckSquare, XCircle, Loader2 } from "lucide-react";
import { getStudyBooks } from "@/lib/data";
import { getBooks } from "@/lib/data";

const UPI_ID = "mohdashfaq1416-1@okicici";

interface PaymentRecord {
  txnId: string;
  bookTitle: string;
  date: string;
  verified: boolean;
}

export default function PaymentsPage() {
  const allBooks = React.useMemo(() => {
    const tech = getBooks().filter((b) => b.group === "tech");
    const study = getStudyBooks();
    return [...study, ...tech];
  }, []);
  const [txnId, setTxnId] = React.useState("");
  const [selectedBook, setSelectedBook] = React.useState("");
  const [payments, setPayments] = React.useState<PaymentRecord[]>([]);
  const [verifiedTxn, setVerifiedTxn] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const stored = localStorage.getItem("dashboard-payments");
    if (!stored) return;
    const t = setTimeout(() => setPayments(JSON.parse(stored) as PaymentRecord[]), 0);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("dashboard-payments", JSON.stringify(payments));
  }, [payments]);

  const pendingVerifications = payments.filter((p) => !p.verified);
  const verifiedPayments = payments.filter((p) => p.verified);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (txnId.trim().length < 5 || !selectedBook) return;
    const record: PaymentRecord = {
      txnId: txnId.trim(),
      bookTitle: selectedBook,
      date: new Date().toISOString(),
      verified: true,
    };
    setPayments([record, ...payments]);
    setVerifiedTxn(txnId.trim());
    setTxnId("");
    setSelectedBook("");
    setTimeout(() => setVerifiedTxn(""), 4000);
  }

  function handleApprove(bookTitle: string) {
    setPayments(payments.map((p) =>
      p.bookTitle === bookTitle && !p.verified
        ? { ...p, verified: true }
        : p
    ));
  }

  function handleReject(bookTitle: string) {
    setPayments(payments.filter((p) => !(p.bookTitle === bookTitle && !p.verified)));
  }

  const filteredBooks = allBooks.filter((b) =>
    !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVerified = verifiedPayments.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Payments</h1>
        <p className="text-sm text-zinc-500 mt-1">Verify payments and access downloads.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-700/30 text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{allBooks.length}</p>
          <p className="text-xs text-blue-600 dark:text-blue-500 flex items-center justify-center gap-1"><BookOpen className="h-3 w-3" /> Books</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-700/30 text-center">
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{totalVerified}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3" /> Verified</p>
        </div>
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 text-center">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{pendingVerifications.length}</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 flex items-center justify-center gap-1"><Clock className="h-3 w-3" /> Pending</p>
        </div>
      </div>

      {pendingVerifications.length > 0 && (
        <div className="mb-6 p-6 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Pending Approvals
          </h2>
          <div className="space-y-3">
            {pendingVerifications.map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{p.bookTitle}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">Txn: {p.txnId}</p>
                    <p className="text-[10px] text-zinc-400">{new Date(p.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleApprove(p.bookTitle)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors">
                      <CheckSquare className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button onClick={() => handleReject(p.bookTitle)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" />
            Payment Verification
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            After making a UPI payment, enter your transaction ID to verify and unlock download access.
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 mb-4">
            <p className="text-xs text-zinc-500 mb-1">Pay via UPI</p>
            <p className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 inline-block select-all">
              {UPI_ID}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Book Purchased</label>
              <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm">
                <option value="">Select a book...</option>
                {allBooks.map((b) => (
                  <option key={b.title} value={b.title}>{b.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">UPI Transaction ID</label>
              <input type="text" value={txnId} onChange={(e) => setTxnId(e.target.value)} required placeholder="e.g. UPI123456789"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm" />
            </div>
            <button type="submit" disabled={!selectedBook || txnId.trim().length < 5}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors">
              <Shield className="h-4 w-4" />
              Verify Payment
            </button>
          </form>

          {verifiedTxn && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Payment verified! Transaction <strong>{verifiedTxn}</strong> confirmed.
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            Verified Payments
          </h2>
          {verifiedPayments.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-8">No payments verified yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {verifiedPayments.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">{p.bookTitle}</span>
                    <span className="text-[10px] text-emerald-600 flex items-center gap-0.5"><CheckCircle className="h-3 w-3" /> Verified</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono">{p.txnId}</p>
                  <p className="text-[10px] text-zinc-400">{new Date(p.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Download className="h-4 w-4 text-blue-500" />
            Downloads
          </h2>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs" />
          </div>
        </div>
        <div className="space-y-2">
          {filteredBooks.map((book) => (
            <div key={book.title} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{book.title}</h3>
                    {book.version && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">v{book.version}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1">{book.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-zinc-400">{book.category}</span>
                    {book.pages && <span className="text-[10px] text-zinc-400">{book.pages} pages</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={book.pdfUrl || `/api/books/pdf?file=${encodeURIComponent(book.source || "")}&mode=download`} target="_blank" rel="noopener noreferrer" download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-medium hover:opacity-90 transition-opacity">
                    <Download className="h-3.5 w-3.5" />
                    PDF
                  </a>
                  {book.epubUrl && (
                    <a href={book.epubUrl} target="_blank" rel="noopener noreferrer" download
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      ePub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <p className="text-center py-8 text-xs text-zinc-400">No books match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
