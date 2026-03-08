import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useClinicSettings } from "../hooks/useClinicSettings";
import {
  useGetDoctors,
  useGetHealthCertificates,
  useGetPatients,
} from "../hooks/useQueries";
import { formatDate, formatDateLong } from "../utils/formatters";

const CLINIC_NAME = "KLINIK BALI MEDIC CARE";
const CLINIC_ADDRESS = "Jl. Kartika Plaza, Kel. Tuban, Kec. Kuta, Bali";
const CLINIC_PHONE = "+62 818-588-911";

interface Props {
  certId: bigint;
  onBack: () => void;
}

export default function PrintSuratSehatPage({ certId, onBack }: Props) {
  const { data: certs } = useGetHealthCertificates();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const { signature, stamp } = useClinicSettings();

  const cert = certs?.find((c) => c.id === certId);
  const patient = cert ? patients?.find((p) => p.id === cert.patientId) : null;
  const doctor = cert ? doctors?.find((d) => d.id === cert.doctorId) : null;

  if (!cert || !patient || !doctor) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Surat tidak ditemukan.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print action bar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
        <button
          type="button"
          data-ocid="print-surat-sehat.back.button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <Button
          data-ocid="print-surat-sehat.button"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Printer className="w-4 h-4" />
          Cetak Surat
        </Button>
      </div>

      {/* Letter document */}
      <div className="print-container max-w-2xl mx-auto my-8 bg-white shadow-lg p-12 print:shadow-none print:my-0">
        {/* Kop Surat */}
        <div className="text-center border-b-4 border-double border-gray-800 pb-4 mb-8">
          <h1 className="font-display text-xl font-bold text-gray-900 uppercase tracking-wider">
            {CLINIC_NAME}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{CLINIC_ADDRESS}</p>
          <p className="text-sm text-gray-600">Telp: {CLINIC_PHONE}</p>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-widest text-gray-800 underline underline-offset-4">
            SURAT KETERANGAN SEHAT
          </h2>
        </div>

        {/* Body */}
        <div className="text-sm text-gray-800 leading-relaxed space-y-4">
          <p>Yang bertanda tangan di bawah ini:</p>

          <div className="grid grid-cols-[180px_1fr] gap-y-1.5 ml-4">
            <span>Nama</span>
            <span>: {doctor.name}</span>
            <span>Spesialisasi</span>
            <span>: {doctor.specialization || "Dokter Umum"}</span>
            <span>Tempat Praktik</span>
            <span>: {CLINIC_NAME}</span>
          </div>

          <p className="mt-4">Menerangkan dengan sebenarnya bahwa:</p>

          <div className="grid grid-cols-[180px_1fr] gap-y-1.5 ml-4">
            <span>Nama Pasien</span>
            <span>
              : <strong>{patient.name}</strong>
            </span>
            <span>No. Pasien</span>
            <span>: {patient.patientNo}</span>
            <span>Jenis Kelamin</span>
            <span>
              :{" "}
              {patient.gender === "male"
                ? "Laki-laki"
                : patient.gender === "female"
                  ? "Perempuan"
                  : "Lainnya"}
            </span>
            <span>Alamat</span>
            <span>: {patient.address || "–"}</span>
          </div>

          {/* Physical Examination Results */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-3">
              Hasil Pemeriksaan Fisik:
            </p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <span className="text-gray-500">Tekanan Darah</span>
                <p className="font-medium">{cert.bloodPressure || "–"}</p>
              </div>
              <div>
                <span className="text-gray-500">Denyut Nadi</span>
                <p className="font-medium">
                  {cert.pulse ? `${String(cert.pulse)} bpm` : "–"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Berat Badan</span>
                <p className="font-medium">
                  {cert.weight ? `${String(cert.weight)} kg` : "–"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Tinggi Badan</span>
                <p className="font-medium">
                  {cert.height ? `${String(cert.height)} cm` : "–"}
                </p>
              </div>
            </div>
          </div>

          <p>
            Berdasarkan pemeriksaan yang telah dilakukan, yang bersangkutan
            dalam <strong>keadaan sehat jasmani dan rohani</strong> dan
            dinyatakan <strong>layak</strong> untuk keperluan:{" "}
            <strong>{cert.purpose}</strong>.
          </p>

          {cert.notes && (
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-gray-600 italic">{cert.notes}</p>
            </div>
          )}

          <p>
            Demikian surat keterangan ini dibuat dengan sebenarnya dan dapat
            dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-10 flex justify-end">
          <div className="text-center relative">
            <p className="text-sm text-gray-700">
              Kuta, Bali, {formatDateLong(cert.issuedDate)}
            </p>
            <p className="text-sm text-gray-700 mt-1">Dokter Pemeriksa,</p>
            <div className="h-16 flex items-center justify-center relative">
              {signature && (
                <img
                  src={signature}
                  alt="Tanda tangan"
                  className="max-h-14 max-w-[160px] object-contain"
                />
              )}
              {stamp && (
                <img
                  src={stamp}
                  alt="Cap klinik"
                  className="absolute -right-8 -top-2 max-h-16 max-w-[80px] object-contain opacity-70"
                />
              )}
            </div>
            <p className="text-sm font-semibold text-gray-900">{doctor.name}</p>
            <p className="text-xs text-gray-500">
              {doctor.specialization || "Dokter Umum"}
            </p>
          </div>
        </div>

        {/* No. Surat */}
        <div className="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-3">
          <p>
            No. Surat: SKSeh/{formatDate(cert.issuedDate).replace(/-/g, "")}/{" "}
            {String(cert.id)}
          </p>
        </div>
      </div>
    </div>
  );
}
