import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useClinicSettings } from "../hooks/useClinicSettings";
import { useGetInvoices, useGetPatients } from "../hooks/useQueries";
import { formatDate, formatRupiah } from "../utils/formatters";

interface Props {
  invoiceId: bigint;
  onBack: () => void;
}

const CLINIC_NAME = "Bali Medic Care";
const CLINIC_DOCTOR = "dr. Romy Kamaluddin";
const CLINIC_ADDRESS = "Jl. Kartika Plaza, Kel. Tuban, Kec. Kuta";
const CLINIC_PHONE = "+62 818-588-911";

export default function PrintInvoicePage({ invoiceId, onBack }: Props) {
  const { data: invoices } = useGetInvoices();
  const { data: patients } = useGetPatients();
  const { signature, stamp, logo } = useClinicSettings();

  const invoice = invoices?.find((inv) => inv.id === invoiceId);
  const patient = invoice
    ? patients?.find((p) => p.id === invoice.patientId)
    : null;

  if (!invoice || !patient) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Invoice not found.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back
        </Button>
      </div>
    );
  }

  const subtotal = invoice.lineItems.reduce(
    (s, li) => s + Number(li.appliedCharge),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print action bar - hidden on print */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
        <button
          type="button"
          data-ocid="print.back.button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <Button
          data-ocid="print.invoice.button"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice document — A4 width */}
      <div className="print-container max-w-[794px] mx-auto my-8 bg-white shadow-lg px-12 py-10 print:shadow-none print:my-0">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          {logo ? (
            <div className="flex items-center gap-4 mb-2">
              <img
                src={logo}
                alt="Clinic Logo"
                className="max-h-16 max-w-[120px] object-contain"
              />
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900">
                  {CLINIC_NAME}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">{CLINIC_DOCTOR}</p>
                <p className="text-xs text-gray-500 mt-0.5">{CLINIC_ADDRESS}</p>
                <p className="text-xs text-gray-500">Telp: {CLINIC_PHONE}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                {CLINIC_NAME}
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">{CLINIC_DOCTOR}</p>
              <p className="text-xs text-gray-500 mt-0.5">{CLINIC_ADDRESS}</p>
              <p className="text-xs text-gray-500">Telp: {CLINIC_PHONE}</p>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-display text-xl font-bold uppercase tracking-widest text-gray-800">
            Proforma Invoice
          </h2>
          {invoice.status === "draft" && (
            <span className="inline-block mt-1 text-xs border border-yellow-500 text-yellow-700 px-3 py-0.5 rounded uppercase tracking-wider font-medium">
              Draft
            </span>
          )}
        </div>

        {/* Patient Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm border border-gray-200 rounded-lg p-4">
          <div>
            <span className="text-gray-500 text-xs">Patient Name</span>
            <p className="font-semibold text-gray-900">{patient.name}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Registration No.</span>
            <p className="font-semibold text-gray-900">{invoice.regNo}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Patient No.</span>
            <p className="text-gray-800">{patient.patientNo}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Registration Date</span>
            <p className="text-gray-800">
              {formatDate(invoice.registrationDate)}
            </p>
          </div>
          {invoice.payer && (
            <div>
              <span className="text-gray-500 text-xs">Payer / Guarantor</span>
              <p className="text-gray-800">{invoice.payer}</p>
            </div>
          )}
          <div>
            <span className="text-gray-500 text-xs">Print Date</span>
            <p className="text-gray-800">
              {formatDate(invoice.dateOfPrinting)}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-xs mb-6 border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left px-3 py-2 font-medium">Date</th>
              <th className="text-left px-3 py-2 font-medium">Category</th>
              <th className="text-left px-3 py-2 font-medium">Description</th>
              <th className="text-right px-3 py-2 font-medium">Base Price</th>
              <th className="text-center px-3 py-2 font-medium">Qty</th>
              <th className="text-right px-3 py-2 font-medium">Discount</th>
              <th className="text-right px-3 py-2 font-medium">Charge</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((li, idx) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: line items are immutable in print view
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border-b border-gray-200 px-3 py-2">
                  {formatDate(li.date)}
                </td>
                <td className="border-b border-gray-200 px-3 py-2">
                  {li.category}
                </td>
                <td className="border-b border-gray-200 px-3 py-2">
                  {li.description}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-right">
                  {formatRupiah(li.basePrice)}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-center">
                  {String(li.qty)}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-right">
                  {formatRupiah(li.discount)}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-right font-medium">
                  {formatRupiah(li.appliedCharge)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={6}
                className="px-3 pt-3 text-right font-semibold text-gray-700"
              >
                Subtotal
              </td>
              <td className="px-3 pt-3 text-right font-bold text-gray-900">
                {formatRupiah(subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan={7} className="px-3">
                <div className="border-t-2 border-gray-800 mt-1" />
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                className="px-3 pt-1 text-right font-bold text-gray-900 text-sm"
              >
                TOTAL BILL
              </td>
              <td className="px-3 pt-1 text-right font-bold text-gray-900 text-sm">
                {formatRupiah(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer — signature + stamp at BOTTOM LEFT */}
        <div className="mt-8 flex justify-start text-xs text-gray-500">
          <div className="text-center">
            <p className="mb-1">
              Kuta, Bali, {formatDate(invoice.dateOfPrinting)}
            </p>
            <p className="mb-1">Examining Doctor,</p>

            {/* Merged signature + stamp overlay */}
            <div className="relative inline-flex items-center justify-center h-32 w-72 mt-1">
              {signature && (
                <img
                  src={signature}
                  alt="Signature"
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              )}
              {stamp && (
                <img
                  src={stamp}
                  alt="Clinic stamp"
                  className="absolute inset-0 w-full h-full object-contain opacity-80 z-20"
                />
              )}
            </div>

            <p className="font-semibold text-gray-800 mt-1">{CLINIC_DOCTOR}</p>
            <p className="text-gray-500">{CLINIC_NAME}</p>
          </div>
        </div>

        <div className="mt-4 text-[10px] text-gray-400 border-t border-gray-100 pt-3 text-center">
          This document was generated electronically
        </div>
      </div>
    </div>
  );
}
