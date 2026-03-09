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
  const { signature, stamp, logo } = useClinicSettings();

  const note = notes?.find((n) => n.id === noteId);
  const patient = note ? patients?.find((p) => p.id === note.patientId) : null;
  const doctor = note ? doctors?.find((d) => d.id === note.doctorId) : null;

  if (!note || !patient || !doctor) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Document not found.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back
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
          Back
        </button>
        <Button
          data-ocid="print-surat-sakit.button"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Document
        </Button>
      </div>

      {/* Letter document — A4 width */}
      <div className="print-container max-w-[794px] mx-auto my-8 bg-white shadow-lg px-12 py-10 print:shadow-none print:my-0 print:px-0 print:py-0">
        {/* Kop Surat */}
        <div className="border-b-4 border-double border-gray-800 pb-4 mb-8">
          {logo ? (
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Clinic Logo"
                className="max-h-16 max-w-[100px] object-contain"
              />
              <div>
                <h1 className="font-display text-xl font-bold text-gray-900 uppercase tracking-wider">
                  {CLINIC_NAME}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{CLINIC_ADDRESS}</p>
                <p className="text-sm text-gray-600">Telp: {CLINIC_PHONE}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="font-display text-xl font-bold text-gray-900 uppercase tracking-wider">
                {CLINIC_NAME}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{CLINIC_ADDRESS}</p>
              <p className="text-sm text-gray-600">Telp: {CLINIC_PHONE}</p>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="font-display text-lg font-bold uppercase tracking-widest text-gray-800 underline underline-offset-4">
            SICK NOTE / MEDICAL CERTIFICATE
          </h2>
        </div>

        {/* Body */}
        <div className="text-sm text-gray-800 leading-relaxed space-y-4">
          <p>The undersigned below:</p>

          <div className="grid grid-cols-[180px_1fr] gap-y-1.5 ml-4">
            <span>Name</span>
            <span>: {doctor.name}</span>
            <span>Specialization</span>
            <span>: {doctor.specialization || "General Practitioner"}</span>
            <span>Practice Location</span>
            <span>: {CLINIC_NAME}</span>
          </div>

          <p className="mt-4">Hereby certifies that:</p>

          <div className="grid grid-cols-[180px_1fr] gap-y-1.5 ml-4">
            <span>Patient Name</span>
            <span>
              : <strong>{patient.name}</strong>
            </span>
            <span>Patient No.</span>
            <span>: {patient.patientNo}</span>
            <span>Gender</span>
            <span>
              :{" "}
              {patient.gender === "male"
                ? "Male"
                : patient.gender === "female"
                  ? "Female"
                  : "Other"}
            </span>
            <span>Address</span>
            <span>: {patient.address || "–"}</span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p>Has been examined and diagnosed with:</p>
            <p className="font-semibold mt-2 text-gray-900">{note.diagnosis}</p>
          </div>

          <p>
            Due to this condition, the above-mentioned patient is advised to{" "}
            <strong>
              rest for {restDays} ({restDays} {restDays === 1 ? "day" : "days"})
            </strong>{" "}
            from <strong>{formatDateLong(note.startDate)}</strong> to{" "}
            <strong>{formatDateLong(note.endDate)}</strong>.
          </p>

          {note.notes && (
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-gray-600 italic">{note.notes}</p>
            </div>
          )}

          <p>This certificate is issued in good faith for use as required.</p>
        </div>

        {/* Signature — BOTTOM LEFT: merged signature + stamp */}
        <div className="mt-10 flex justify-start">
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Kuta, Bali, {formatDateLong(note.issuedDate)}
            </p>
            <p className="text-sm text-gray-700 mt-1">Examining Doctor,</p>

            {/* Merged signature + stamp overlay */}
            <div className="relative inline-flex items-center justify-center mt-2 h-24 w-56">
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

            <p className="text-sm font-semibold text-gray-900 mt-1">
              {doctor.name}
            </p>
            <p className="text-xs text-gray-500">
              {doctor.specialization || "General Practitioner"}
            </p>
          </div>
        </div>

        {/* Doc Number */}
        <div className="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-3">
          <p>
            Doc No.: SKS/{formatDate(note.issuedDate).replace(/-/g, "")}/{" "}
            {String(note.id)}
          </p>
        </div>
      </div>
    </div>
  );
}
