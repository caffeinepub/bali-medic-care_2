import { g as useGetHealthCertificates, u as useGetPatients, h as useGetDoctors, G as useCreateHealthCertificate, I as useDeleteHealthCertificate, r as reactExports, j as jsxRuntimeExports, B as Button, c as ue } from "./index-Cj1LDNoz.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CJzCXspO.js";
import { C as Card, c as CardContent } from "./card-Do55eSVE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-12BErvOy.js";
import { P as Plus, I as Input } from "./Combination-LFyt6rgd.js";
import { L as Label } from "./label-DuCZGXsM.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-gDKftB0e.js";
import { S as Skeleton } from "./skeleton-yQPGKswp.js";
import { T as Textarea } from "./textarea-Dzx6x50u.js";
import { t as todayInputValue, a as formatDate, d as dateToBigIntNanos } from "./formatters-DRYxEYqJ.js";
import { P as Printer } from "./printer-DCYWeBhL.js";
import { T as Trash2 } from "./trash-2-CWr4IgiC.js";
const emptyForm = () => ({
  patientId: "",
  doctorId: "",
  purpose: "",
  issuedDate: todayInputValue(),
  notes: "",
  bloodPressure: "",
  pulse: "",
  weight: "",
  height: ""
});
function SuratSehatPage({ onPrint }) {
  const { data: certs, isLoading } = useGetHealthCertificates();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const createMutation = useCreateHealthCertificate();
  const deleteMutation = useDeleteHealthCertificate();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const openCreate = () => {
    setForm(emptyForm());
    setFormOpen(true);
  };
  const handleSubmit = async () => {
    if (!form.patientId || !form.doctorId || !form.purpose) {
      ue.error("Patient, doctor, and purpose are required");
      return;
    }
    try {
      await createMutation.mutateAsync({
        patientId: BigInt(form.patientId),
        doctorId: BigInt(form.doctorId),
        purpose: form.purpose,
        issuedDate: dateToBigIntNanos(form.issuedDate),
        notes: form.notes,
        bloodPressure: form.bloodPressure,
        pulse: BigInt(Number.parseInt(form.pulse) || 0),
        weight: BigInt(Number.parseInt(form.weight) || 0),
        height: BigInt(Number.parseInt(form.height) || 0)
      });
      ue.success("Health Certificate created");
      setFormOpen(false);
    } catch {
      ue.error("Failed to create health certificate");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      ue.success("Document deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete document");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Health Certificates" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage patient health certificates" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "surat-sehat.open_modal_button",
          onClick: openCreate,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New Certificate"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, i)) }) : (certs ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "surat-sehat.empty_state",
        className: "text-center py-12 text-muted-foreground",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No health certificates yet" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Doctor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Purpose" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Issued Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (certs ?? []).map((cert, idx) => {
        const patient = patients == null ? void 0 : patients.find(
          (p) => p.id === cert.patientId
        );
        const doctor = doctors == null ? void 0 : doctors.find((d) => d.id === cert.doctorId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `surat-sehat.row.${idx + 1}`,
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: (patient == null ? void 0 : patient.name) ?? "–" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden sm:table-cell", children: (doctor == null ? void 0 : doctor.name) ?? "–" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[180px] truncate", children: cert.purpose }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatDate(cert.issuedDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `surat-sehat.print.button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => onPrint(cert.id),
                    className: "h-8 w-8 p-0 text-primary",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `surat-sehat.delete_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setDeleteId(cert.id),
                    className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          String(cert.id)
        );
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: formOpen, onOpenChange: setFormOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", "data-ocid": "surat-sehat.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Create Health Certificate" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.patientId,
              onValueChange: (v) => setForm((f) => ({ ...f, patientId: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "surat-sehat.patient.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select patient" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (patients ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(p.id), children: [
                  p.name,
                  " (",
                  p.patientNo,
                  ")"
                ] }, String(p.id))) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Doctor *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.doctorId,
              onValueChange: (v) => setForm((f) => ({ ...f, doctorId: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "surat-sehat.doctor.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select doctor" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (doctors ?? []).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(d.id), children: d.name }, String(d.id))) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "purpose", children: "Purpose *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "purpose",
              "data-ocid": "surat-sehat.purpose.input",
              value: form.purpose,
              onChange: (e) => setForm((f) => ({ ...f, purpose: e.target.value })),
              placeholder: "e.g. Employment, civil service exam, etc.",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bp", children: "Blood Pressure" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "bp",
                "data-ocid": "surat-sehat.blood_pressure.input",
                value: form.bloodPressure,
                onChange: (e) => setForm((f) => ({ ...f, bloodPressure: e.target.value })),
                placeholder: "120/80 mmHg",
                className: "mt-1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pulse", children: "Pulse (bpm)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pulse",
                type: "number",
                "data-ocid": "surat-sehat.pulse.input",
                value: form.pulse,
                onChange: (e) => setForm((f) => ({ ...f, pulse: e.target.value })),
                placeholder: "80",
                className: "mt-1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "weight", children: "Weight (kg)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "weight",
                type: "number",
                "data-ocid": "surat-sehat.weight.input",
                value: form.weight,
                onChange: (e) => setForm((f) => ({ ...f, weight: e.target.value })),
                placeholder: "60",
                className: "mt-1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "height", children: "Height (cm)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "height",
                type: "number",
                "data-ocid": "surat-sehat.height.input",
                value: form.height,
                onChange: (e) => setForm((f) => ({ ...f, height: e.target.value })),
                placeholder: "165",
                className: "mt-1"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "issuedDate", children: "Issue Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "issuedDate",
              type: "date",
              "data-ocid": "surat-sehat.issued_date.input",
              value: form.issuedDate,
              onChange: (e) => setForm((f) => ({ ...f, issuedDate: e.target.value })),
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "notes", children: "Additional Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "notes",
              "data-ocid": "surat-sehat.textarea",
              value: form.notes,
              onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
              placeholder: "Additional notes (optional)",
              className: "mt-1",
              rows: 3
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "surat-sehat.cancel_button",
            variant: "outline",
            onClick: () => setFormOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "surat-sehat.submit_button",
            onClick: handleSubmit,
            disabled: createMutation.isPending,
            children: createMutation.isPending ? "Saving..." : "Create Certificate"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "surat-sehat.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Health Certificate?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The document will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "surat-sehat.cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            "data-ocid": "surat-sehat.confirm_button",
            onClick: handleDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  SuratSehatPage as default
};
