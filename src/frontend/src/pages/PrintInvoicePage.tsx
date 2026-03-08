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
  const { signature, stamp } = useClinicSettings();

  const invoice = invoices?.find((inv) => inv.id === invoiceId);
  const patient = invoice
    ? patients?.find((p) => p.id === invoice.patientId)
    : null;

  if (!invoice || !patient) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Invoice tidak ditemukan.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Kembali
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
          Kembali
        </button>
        <Button
          data-ocid="print.invoice.button"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Printer className="w-4 h-4" />
          Cetak Invoice
        </Button>
      </div>

      {/* Invoice document */}
      <div className="print-container max-w-3xl mx-auto my-8 bg-white shadow-lg p-10 print:shadow-none print:my-0 print:p-8">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {CLINIC_NAME}
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">{CLINIC_DOCTOR}</p>
          <p className="text-xs text-gray-500 mt-0.5">{CLINIC_ADDRESS}</p>
          <p className="text-xs text-gray-500">Telp: {CLINIC_PHONE}</p>
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
            <span className="text-gray-500 text-xs">Nama Pasien</span>
            <p className="font-semibold text-gray-900">{patient.name}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">No. Registrasi</span>
            <p className="font-semibold text-gray-900">{invoice.regNo}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">No. Pasien</span>
            <p className="text-gray-800">{patient.patientNo}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Tgl. Registrasi</span>
            <p className="text-gray-800">
              {formatDate(invoice.registrationDate)}
            </p>
          </div>
          {invoice.payer && (
            <div>
              <span className="text-gray-500 text-xs">Payer / Penanggung</span>
              <p className="text-gray-800">{invoice.payer}</p>
            </div>
          )}
          <div>
            <span className="text-gray-500 text-xs">Tanggal Cetak</span>
            <p className="text-gray-800">
              {formatDate(invoice.dateOfPrinting)}
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full text-xs mb-6 border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left px-3 py-2 font-medium">Tanggal</th>
              <th className="text-left px-3 py-2 font-medium">Kategori</th>
              <th className="text-left px-3 py-2 font-medium">Keterangan</th>
              <th className="text-right px-3 py-2 font-medium">Harga Dasar</th>
              <th className="text-center px-3 py-2 font-medium">Qty</th>
              <th className="text-right px-3 py-2 font-medium">Diskon</th>
              <th className="text-right px-3 py-2 font-medium">Tagihan</th>
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
                TOTAL TAGIHAN
              </td>
              <td className="px-3 pt-1 text-right font-bold text-gray-900 text-sm">
                {formatRupiah(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-end text-xs text-gray-500">
          <div>
            <p className="mb-2">
              Kuta, Bali, {formatDate(invoice.dateOfPrinting)}
            </p>
            <p className="mb-1">Dokter Pemeriksa,</p>
            <div className="h-16 flex items-center justify-start">
              {signature && (
                <img
                  src={signature}
                  alt="Tanda tangan"
                  className="max-h-16 max-w-[180px] object-contain"
                />
              )}
            </div>
            <p className="font-semibold text-gray-800">{CLINIC_DOCTOR}</p>
            <p className="text-gray-500">{CLINIC_NAME}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {stamp && (
              <img
                src={stamp}
                alt="Cap klinik"
                className="max-h-16 max-w-[100px] object-contain opacity-80"
              />
            )}
            <p className="text-gray-400 text-[10px]">
              Dokumen ini dihasilkan secara elektronik
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
