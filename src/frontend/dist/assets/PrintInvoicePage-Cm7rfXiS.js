import { e as useGetInvoices, u as useGetPatients, j as jsxRuntimeExports, B as Button } from "./index-Cj1LDNoz.js";
import { u as useClinicSettings } from "./useClinicSettings-D76nAH59.js";
import { a as formatDate, f as formatRupiah } from "./formatters-DRYxEYqJ.js";
import { A as ArrowLeft } from "./arrow-left-BfcCSedf.js";
import { P as Printer } from "./printer-DCYWeBhL.js";
const CLINIC_NAME = "Bali Medic Care";
const CLINIC_DOCTOR = "dr. Romy Kamaluddin";
const CLINIC_ADDRESS = "Jl. Kartika Plaza, Kel. Tuban, Kec. Kuta";
const CLINIC_PHONE = "+62 818-588-911";
function PrintInvoicePage({ invoiceId, onBack }) {
  const { data: invoices } = useGetInvoices();
  const { data: patients } = useGetPatients();
  const { signature, stamp, logo } = useClinicSettings();
  const invoice = invoices == null ? void 0 : invoices.find((inv) => inv.id === invoiceId);
  const patient = invoice ? patients == null ? void 0 : patients.find((p) => p.id === invoice.patientId) : null;
  if (!invoice || !patient) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Invoice not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onBack, className: "mt-4", children: "Back" })
    ] });
  }
  const subtotal = invoice.lineItems.reduce(
    (s, li) => s + Number(li.appliedCharge),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-print sticky top-0 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "print.back.button",
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
          "data-ocid": "print.invoice.button",
          onClick: () => window.print(),
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-4 h-4" }),
            "Print Invoice"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "print-container max-w-[794px] mx-auto my-8 bg-white shadow-lg px-12 py-10 print:shadow-none print:my-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b-2 border-gray-800 pb-4 mb-6", children: logo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: logo,
            alt: "Clinic Logo",
            className: "max-h-16 max-w-[120px] object-contain"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-gray-900", children: CLINIC_NAME }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-0.5", children: CLINIC_DOCTOR }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: CLINIC_ADDRESS }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
            "Telp: ",
            CLINIC_PHONE
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-gray-900", children: CLINIC_NAME }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 mt-0.5", children: CLINIC_DOCTOR }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 mt-0.5", children: CLINIC_ADDRESS }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
          "Telp: ",
          CLINIC_PHONE
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold uppercase tracking-widest text-gray-800", children: "Proforma Invoice" }),
        invoice.status === "draft" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 text-xs border border-yellow-500 text-yellow-700 px-3 py-0.5 rounded uppercase tracking-wider font-medium", children: "Draft" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm border border-gray-200 rounded-lg p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "Patient Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: patient.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "Registration No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-900", children: invoice.regNo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "Patient No." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800", children: patient.patientNo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "Registration Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800", children: formatDate(invoice.registrationDate) })
        ] }),
        invoice.payer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "Payer / Guarantor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800", children: invoice.payer })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-500 text-xs", children: "Print Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-800", children: formatDate(invoice.dateOfPrinting) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs mb-6 border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-gray-800 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2 font-medium", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium", children: "Base Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2 font-medium", children: "Qty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium", children: "Discount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2 font-medium", children: "Charge" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: invoice.lineItems.map((li, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: idx % 2 === 0 ? "bg-white" : "bg-gray-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2", children: formatDate(li.date) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2", children: li.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2", children: li.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2 text-right", children: formatRupiah(li.basePrice) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2 text-center", children: String(li.qty) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2 text-right", children: formatRupiah(li.discount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "border-b border-gray-200 px-3 py-2 text-right font-medium", children: formatRupiah(li.appliedCharge) })
            ]
          },
          idx
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tfoot", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 6,
                className: "px-3 pt-3 text-right font-semibold text-gray-700",
                children: "Subtotal"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 pt-3 text-right font-bold text-gray-900", children: formatRupiah(subtotal) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t-2 border-gray-800 mt-1" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 6,
                className: "px-3 pt-1 text-right font-bold text-gray-900 text-sm",
                children: "TOTAL BILL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 pt-1 text-right font-bold text-gray-900 text-sm", children: formatRupiah(subtotal) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex justify-start text-xs text-gray-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-1", children: [
          "Kuta, Bali, ",
          formatDate(invoice.dateOfPrinting)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1", children: "Examining Doctor," }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative inline-flex items-center justify-center h-32 w-72 mt-1", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-gray-800 mt-1", children: CLINIC_DOCTOR }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-500", children: CLINIC_NAME })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-[10px] text-gray-400 border-t border-gray-100 pt-3 text-center", children: "This document was generated electronically" })
    ] })
  ] });
}
export {
  PrintInvoicePage as default
};
