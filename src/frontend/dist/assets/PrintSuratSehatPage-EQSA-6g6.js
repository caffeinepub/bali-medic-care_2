import { g as useGetHealthCertificates, u as useGetPatients, h as useGetDoctors, j as jsxRuntimeExports, B as Button } from "./index-Cj1LDNoz.js";
import { u as useClinicSettings } from "./useClinicSettings-D76nAH59.js";
import { b as formatDateLong, a as formatDate } from "./formatters-DRYxEYqJ.js";
import { A as ArrowLeft } from "./arrow-left-BfcCSedf.js";
import { P as Printer } from "./printer-DCYWeBhL.js";
const CLINIC_NAME = "KLINIK BALI MEDIC CARE";
const CLINIC_ADDRESS = "Jl. Kartika Plaza, Kel. Tuban, Kec. Kuta, Bali";
const CLINIC_PHONE = "+62 818-588-911";
function PrintSuratSehatPage({ certId, onBack }) {
  const { data: certs } = useGetHealthCertificates();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const { signature, stamp, logo } = useClinicSettings();
  const cert = certs == null ? void 0 : certs.find((c) => c.id === certId);
  const patient = cert ? patients == null ? void 0 : patients.find((p) => p.id === cert.patientId) : null;
  const doctor = cert ? doctors == null ? void 0 : doctors.find((d) => d.id === cert.doctorId) : null;
  if (!cert || !patient || !doctor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Document not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onBack, className: "mt-4", children: "Back" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-print sticky top-0 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "print-surat-sehat.back.button",
          onClick: onBack,
          className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "print-surat-sehat.button",
          onClick: () => window.print(),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4" }),
            "Print Document"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-container max-w-[794px] mx-auto my-8 bg-white shadow-lg px-12 py-10 print:shadow-none print:my-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b-4 border-double border-gray-800 pb-4 mb-8", children: logo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logo,
            alt: "Clinic Logo",
            className: "max-h-16 max-w-[100px] object-contain"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-gray-900 uppercase tracking-wider", children: CLINIC_NAME }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-1", children: CLINIC_ADDRESS }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
            "Telp: ",
            CLINIC_PHONE
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-gray-900 uppercase tracking-wider", children: CLINIC_NAME }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-1", children: CLINIC_ADDRESS }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600", children: [
          "Telp: ",
          CLINIC_PHONE
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold uppercase tracking-widest text-gray-800 underline underline-offset-4", children: "HEALTH CERTIFICATE" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-gray-800 leading-relaxed space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The undersigned below:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[180px_1fr] gap-y-1.5 ml-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ": ",
            doctor.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Specialization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ": ",
            doctor.specialization || "General Practitioner"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Practice Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ": ",
            CLINIC_NAME
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4", children: "Hereby truthfully certifies that:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[180px_1fr] gap-y-1.5 ml-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Patient Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ": ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: patient.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Patient No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ": ",
            patient.patientNo
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gender" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ":",
            " ",
            patient.gender === "male" ? "Male" : patient.gender === "female" ? "Female" : "Other"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            ": ",
            patient.address || "–"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-gray-200 rounded-lg p-4 bg-gray-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-800 mb-3", children: "Physical Examination Results:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Blood Pressure" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: cert.bloodPressure || "–" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: cert.pulse ? `${String(cert.pulse)} bpm` : "–" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Weight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: cert.weight ? `${String(cert.weight)} kg` : "–" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500", children: "Height" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: cert.height ? `${String(cert.height)} cm` : "–" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Based on the examination conducted, the above-mentioned individual is in ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "good physical and mental health" }),
          " and is declared ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "fit" }),
          " for the purpose of:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: cert.purpose }),
          "."
        ] }),
        cert.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-l-4 border-gray-300 pl-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 italic", children: cert.notes }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This certificate is issued truthfully and may be used as required." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-700", children: [
          "Kuta, Bali, ",
          formatDateLong(cert.issuedDate)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-700 mt-1", children: "Examining Doctor," }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center mt-2 h-32 w-72", children: [
          signature && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: signature,
              alt: "Signature",
              className: "absolute inset-0 w-full h-full object-contain z-10"
            }
          ),
          stamp && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: stamp,
              alt: "Clinic stamp",
              className: "absolute inset-0 w-full h-full object-contain opacity-80 z-20"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-gray-900 mt-1", children: doctor.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: doctor.specialization || "General Practitioner" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-xs text-gray-400 border-t border-gray-100 pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Doc No.: SKSeh/",
        formatDate(cert.issuedDate).replace(/-/g, ""),
        "/",
        " ",
        String(cert.id)
      ] }) })
    ] })
  ] });
}
export {
  PrintSuratSehatPage as default
};
