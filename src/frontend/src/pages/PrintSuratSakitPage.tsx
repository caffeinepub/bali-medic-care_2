import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useClinicSettings } from "../hooks/useClinicSettings";
import {
  useGetDoctors,
  useGetPatients,
  useGetSickNotes,
} from "../hooks/useQueries";
import { formatDate, formatDateLong } from "../utils/formatters";

const CLINIC_NAME = "KLINIK BALI MEDIC CARE";
const CLINIC_ADDRESS = "Jl. Kartika Plaza, Kel. Tuban, Kec. Kuta, Bali";
const CLINIC_PHONE = "+62 818-588-911";

interface Props {
  noteId: bigint;
  onBack: () => void;
}

export default function PrintSuratSakitPage({ noteId, onBack }: Props) {
  const { data: notes } = useGetSickNotes();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const { signature, stamp } = useClinicSettings();

  const note = notes?.find((n) => n.id === noteId);
  const patient = note ? patients?.find((p) => p.id === note.patientId) : null;
  const doctor = note ? doctors?.find((d) => d.id === note.doctorId) : null;

  if (!note || !patient || !doctor) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Surat tidak ditemukan.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  const restDays = Number(note.restDays);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print action bar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between shadow-sm">
        <button
          type="button"
          data-ocid="print-surat-sakit.back.button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <Button
          data-ocid="print-surat-sakit.button"
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
            SURAT KETERANGAN SAKIT
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

          <p className="mt-4">Dengan ini menerangkan bahwa:</p>

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

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>
              Telah diperiksa dan dinyatakan menderita sakit dengan diagnosis:
            </p>
            <p className="font-semibold mt-2 text-gray-900">{note.diagnosis}</p>
          </div>

          <p>
            Sehubungan dengan kondisi tersebut, yang bersangkutan dianjurkan
            untuk{" "}
            <strong>
              beristirahat selama {restDays} (
              {restDays === 1
                ? "satu"
                : restDays === 2
                  ? "dua"
                  : restDays === 3
                    ? "tiga"
                    : restDays === 4
                      ? "empat"
                      : restDays === 5
                        ? "lima"
                        : `${restDays}`}
              ) hari
            </strong>{" "}
            terhitung mulai tanggal{" "}
            <strong>{formatDateLong(note.startDate)}</strong> sampai dengan{" "}
            <strong>{formatDateLong(note.endDate)}</strong>.
          </p>

          {note.notes && (
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-gray-600 italic">{note.notes}</p>
            </div>
          )}

          <p>
            Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat
            dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* Signature */}
        <div className="mt-10 flex justify-end">
          <div className="text-center relative">
            <p className="text-sm text-gray-700">
              Kuta, Bali, {formatDateLong(note.issuedDate)}
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
            No. Surat: SKS/{formatDate(note.issuedDate).replace(/-/g, "")}/{" "}
            {String(note.id)}
          </p>
        </div>
      </div>
    </div>
  );
}
