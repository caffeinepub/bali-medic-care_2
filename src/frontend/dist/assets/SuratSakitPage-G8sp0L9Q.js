import { f as useGetSickNotes, u as useGetPatients, h as useGetDoctors, K as useCreateSickNote, M as useDeleteSickNote, r as reactExports, j as jsxRuntimeExports, B as Button, c as ue } from "./index-DyL3gOAQ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-COKx9z3I.js";
import { C as Card, c as CardContent } from "./card-xuZxmpC-.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-EvFKn-os.js";
import { P as Plus, I as Input } from "./Combination-RxT-5ZDg.js";
import { L as Label } from "./label-RqSgi2UX.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-mTwswc-Y.js";
import { S as Skeleton } from "./skeleton-C53PxwGh.js";
import { T as Textarea } from "./textarea-DGnqtucf.js";
import { F as FileSpreadsheet, e as exportToExcel } from "./exportExcel-FmF2Z34x.js";
import { t as todayInputValue, c as calcDaysBetween, a as formatDate, d as dateToBigIntNanos } from "./formatters-DRYxEYqJ.js";
import { P as Printer } from "./printer-Vhw2GDDr.js";
import { T as Trash2 } from "./trash-2-C8ShOvDJ.js";
import "./index-Bk2maIQh.js";
import "./index-4zXjPPiL.js";
const emptyForm = () => ({
  patientId: "",
  doctorId: "",
  diagnosis: "",
  startDate: todayInputValue(),
  endDate: todayInputValue(),
  issuedDate: todayInputValue(),
  notes: ""
});
function SuratSakitPage({ onPrint }) {
  const { data: notes, isLoading } = useGetSickNotes();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const createMutation = useCreateSickNote();
  const deleteMutation = useDeleteSickNote();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm());
  const restDays = calcDaysBetween(form.startDate, form.endDate);
  const openCreate = () => {
    setForm(emptyForm());
    setFormOpen(true);
  };
  const handleSubmit = async () => {
    if (!form.patientId || !form.doctorId || !form.diagnosis) {
      ue.error("Patient, doctor, and diagnosis are required");
      return;
    }
    try {
      await createMutation.mutateAsync({
        patientId: BigInt(form.patientId),
        doctorId: BigInt(form.doctorId),
        diagnosis: form.diagnosis,
        startDate: dateToBigIntNanos(form.startDate),
        endDate: dateToBigIntNanos(form.endDate),
        restDays: BigInt(restDays),
        issuedDate: dateToBigIntNanos(form.issuedDate),
        notes: form.notes
      });
      ue.success("Sick Note created");
      setFormOpen(false);
    } catch {
      ue.error("Failed to create sick note");
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Sick Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage patient sick notes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "sick-certificates.export_button",
            variant: "outline",
            onClick: () => {
              const rows = (notes ?? []).map((n) => {
                const patient = patients == null ? void 0 : patients.find((p) => p.id === n.patientId);
                const doctor = doctors == null ? void 0 : doctors.find((dd) => dd.id === n.doctorId);
                return {
                  Patient: (patient == null ? void 0 : patient.name) ?? String(n.patientId),
                  Doctor: (doctor == null ? void 0 : doctor.name) ?? String(n.doctorId),
                  Diagnosis: n.diagnosis,
                  "Start Date": new Date(
                    Number(n.startDate / BigInt(1e6))
                  ).toLocaleDateString(),
                  "End Date": new Date(
                    Number(n.endDate / BigInt(1e6))
                  ).toLocaleDateString(),
                  "Rest Days": Number(n.restDays),
                  Notes: n.notes
                };
              });
              exportToExcel(rows, "sick-certificates");
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "w-4 h-4" }),
              "Export"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "surat-sakit.open_modal_button",
            onClick: openCreate,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "New Sick Note"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, i)) }) : (notes ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "surat-sakit.empty_state",
        className: "text-center py-12 text-muted-foreground",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No sick notes yet" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Doctor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Diagnosis" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Period" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Rest Days" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Issued Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (notes ?? []).map((note, idx) => {
        const patient = patients == null ? void 0 : patients.find(
          (p) => p.id === note.patientId
        );
        const doctor = doctors == null ? void 0 : doctors.find((d) => d.id === note.doctorId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `surat-sakit.row.${idx + 1}`,
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: (patient == null ? void 0 : patient.name) ?? "–" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden sm:table-cell", children: (doctor == null ? void 0 : doctor.name) ?? "–" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[180px] truncate", children: note.diagnosis }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell whitespace-nowrap", children: [
                formatDate(note.startDate),
                " –",
                " ",
                formatDate(note.endDate)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-center font-medium hidden md:table-cell", children: [
                String(note.restDays),
                " days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: formatDate(note.issuedDate) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `surat-sakit.print.button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => onPrint(note.id),
                    className: "h-8 w-8 p-0 text-primary",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `surat-sakit.delete_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setDeleteId(note.id),
                    className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          String(note.id)
        );
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: formOpen, onOpenChange: setFormOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", "data-ocid": "surat-sakit.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Create Sick Note" }) }),
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
                    "data-ocid": "surat-sakit.patient.select",
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
                    "data-ocid": "surat-sakit.doctor.select",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "diagnosis", children: "Diagnosis *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "diagnosis",
              "data-ocid": "surat-sakit.diagnosis.input",
              value: form.diagnosis,
              onChange: (e) => setForm((f) => ({ ...f, diagnosis: e.target.value })),
              placeholder: "Medical diagnosis",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "startDate", children: "Start Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "startDate",
                type: "date",
                "data-ocid": "surat-sakit.start_date.input",
                value: form.startDate,
                onChange: (e) => setForm((f) => ({ ...f, startDate: e.target.value })),
                className: "mt-1"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "endDate", children: "End Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "endDate",
                type: "date",
                "data-ocid": "surat-sakit.end_date.input",
                value: form.endDate,
                onChange: (e) => setForm((f) => ({ ...f, endDate: e.target.value })),
                className: "mt-1"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted rounded-lg p-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Rest period: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            restDays,
            " days"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "issuedDate", children: "Issue Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "issuedDate",
              type: "date",
              "data-ocid": "surat-sakit.issued_date.input",
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
              "data-ocid": "surat-sakit.textarea",
              value: form.notes,
              onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
              placeholder: "Notes for patient (optional)",
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
            "data-ocid": "surat-sakit.cancel_button",
            variant: "outline",
            onClick: () => setFormOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "surat-sakit.submit_button",
            onClick: handleSubmit,
            disabled: createMutation.isPending,
            children: createMutation.isPending ? "Saving..." : "Create Sick Note"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "surat-sakit.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Sick Note?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The document will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "surat-sakit.cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            "data-ocid": "surat-sakit.confirm_button",
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
  SuratSakitPage as default
};
