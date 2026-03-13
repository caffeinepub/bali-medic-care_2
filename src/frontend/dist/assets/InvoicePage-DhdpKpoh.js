import { e as useGetInvoices, u as useGetPatients, m as useDeleteInvoice, r as reactExports, j as jsxRuntimeExports, B as Button, X, F as FileText, c as ue } from "./index-DyL3gOAQ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-COKx9z3I.js";
import { B as Badge } from "./badge-D99FEj8n.js";
import { C as Card, c as CardContent } from "./card-xuZxmpC-.js";
import { P as Plus, I as Input } from "./Combination-RxT-5ZDg.js";
import { S as Skeleton } from "./skeleton-C53PxwGh.js";
import { F as FileSpreadsheet, e as exportToExcel } from "./exportExcel-FmF2Z34x.js";
import { a as formatDate, f as formatRupiah } from "./formatters-DRYxEYqJ.js";
import { S as Search } from "./search-CB94ecWd.js";
import { P as Printer } from "./printer-Vhw2GDDr.js";
import { T as Trash2 } from "./trash-2-C8ShOvDJ.js";
import "./index-Bk2maIQh.js";
function InvoicePage({ onCreateNew, onPrint }) {
  const { data: invoices, isLoading } = useGetInvoices();
  const { data: patients } = useGetPatients();
  const deleteMutation = useDeleteInvoice();
  const [search, setSearch] = reactExports.useState("");
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const filtered = (invoices ?? []).filter((inv) => {
    const patient = patients == null ? void 0 : patients.find((p) => p.id === inv.patientId);
    const q = search.toLowerCase();
    return inv.regNo.toLowerCase().includes(q) || ((patient == null ? void 0 : patient.name.toLowerCase().includes(q)) ?? false);
  });
  const getTotal = (inv) => inv.lineItems.reduce((sum, li) => sum + Number(li.appliedCharge), 0);
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      ue.success("Invoice deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete invoice");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Invoice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Clinic Proforma Invoice" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "invoices.export_button",
            variant: "outline",
            onClick: () => {
              const rows = (invoices ?? []).map((invItem) => {
                const patient = patients == null ? void 0 : patients.find(
                  (p) => p.id === invItem.patientId
                );
                return {
                  "Reg No": invItem.regNo,
                  Patient: (patient == null ? void 0 : patient.name) ?? String(invItem.patientId),
                  Payer: invItem.payer ?? "",
                  Status: invItem.status,
                  "Total (IDR)": invItem.lineItems.reduce(
                    (s, li) => s + Number(li.appliedCharge),
                    0
                  )
                };
              });
              exportToExcel(rows, "invoices");
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
            "data-ocid": "invoice.open_modal_button",
            onClick: onCreateNew,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "New Invoice"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "invoice.search_input",
          placeholder: "Search by patient name or registration number...",
          className: "pl-9",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      ),
      search && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
          onClick: () => setSearch(""),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "invoice.empty_state",
        className: "flex flex-col items-center py-12 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-10 h-10 mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "No invoices found" : "No invoices yet" }),
          !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "invoice.primary_button",
              variant: "outline",
              size: "sm",
              className: "mt-3 gap-2",
              onClick: onCreateNew,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Create First Invoice"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Reg No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((inv, idx) => {
        const patient = patients == null ? void 0 : patients.find(
          (p) => p.id === inv.patientId
        );
        const total = getTotal(inv);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `invoice.row.${idx + 1}`,
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded", children: inv.regNo }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: (patient == null ? void 0 : patient.name) ?? "–" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: formatDate(inv.dateOfPrinting) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold", children: formatRupiah(total) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: inv.status === "final" ? "default" : "secondary",
                  className: `text-xs ${inv.status === "final" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700"}`,
                  children: inv.status === "final" ? "Final" : "Draft"
                }
              ) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `invoice.print.button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => onPrint(inv.id),
                    className: "h-8 w-8 p-0 text-primary",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `invoice.delete_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setDeleteId(inv.id),
                    className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          String(inv.id)
        );
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "invoice.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Invoice?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This invoice will be permanently deleted and cannot be recovered." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "invoice.cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            "data-ocid": "invoice.confirm_button",
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
  InvoicePage as default
};
