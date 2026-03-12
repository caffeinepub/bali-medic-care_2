import { a as useGetServices, n as useCreateService, o as useUpdateService, p as useDeleteService, r as reactExports, j as jsxRuntimeExports, B as Button, c as ue } from "./index-Cj1LDNoz.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CJzCXspO.js";
import { C as Card, c as CardContent } from "./card-Do55eSVE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-12BErvOy.js";
import { P as Plus, I as Input } from "./Combination-LFyt6rgd.js";
import { L as Label } from "./label-DuCZGXsM.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-gDKftB0e.js";
import { S as Skeleton } from "./skeleton-yQPGKswp.js";
import { f as formatRupiah } from "./formatters-DRYxEYqJ.js";
import { P as Pencil } from "./pencil-DsSimgtt.js";
import { T as Trash2 } from "./trash-2-CWr4IgiC.js";
const CATEGORIES = [
  "TINDAKAN",
  "OBAT",
  "LABORATORIUM",
  "KONSULTASI",
  "LAINNYA"
];
const emptyForm = {
  name: "",
  category: "TINDAKAN",
  basePrice: ""
};
const categoryColors = {
  TINDAKAN: "bg-blue-50 text-blue-700",
  OBAT: "bg-green-50 text-green-700",
  LABORATORIUM: "bg-purple-50 text-purple-700",
  KONSULTASI: "bg-amber-50 text-amber-700",
  LAINNYA: "bg-gray-100 text-gray-700"
};
function KatalogLayananPage() {
  const { data: services, isLoading } = useGetServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editService, setEditService] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const openCreate = () => {
    setEditService(null);
    setForm(emptyForm);
    setFormOpen(true);
  };
  const openEdit = (s) => {
    setEditService(s);
    setForm({
      name: s.name,
      category: s.category,
      basePrice: String(s.basePrice)
    });
    setFormOpen(true);
  };
  const handleSubmit = async () => {
    if (!form.name || !form.basePrice) {
      ue.error("Name and price are required");
      return;
    }
    const price = BigInt(
      Math.round(
        Number.parseFloat(form.basePrice.replace(/[^0-9.]/g, "")) || 0
      )
    );
    try {
      if (editService) {
        await updateMutation.mutateAsync({
          id: editService.id,
          name: form.name,
          category: form.category,
          basePrice: price
        });
        ue.success("Service updated");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          category: form.category,
          basePrice: price
        });
        ue.success("New service added");
      }
      setFormOpen(false);
    } catch {
      ue.error("Failed to save service");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      ue.success("Service deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete service");
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Service Catalog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage clinic services and procedures" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "katalog.open_modal_button",
          onClick: openCreate,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Service"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : (services ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "katalog.empty_state",
        className: "text-center py-12 text-muted-foreground",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No services registered yet" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Service Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Base Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (services ?? []).map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `katalog.row.${idx + 1}`,
          className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: s.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs px-2 py-0.5 rounded font-medium ${categoryColors[s.category] ?? "bg-gray-100 text-gray-700"}`,
                children: s.category
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-medium", children: formatRupiah(s.basePrice) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `katalog.edit_button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: () => openEdit(s),
                  className: "h-8 w-8 p-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `katalog.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setDeleteId(s.id),
                  className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] }) })
          ]
        },
        String(s.id)
      )) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: formOpen, onOpenChange: setFormOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "katalog.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editService ? "Edit Service" : "Add New Service" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-name", children: "Service Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "s-name",
              "data-ocid": "katalog.input",
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              placeholder: "Service name",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => setForm((f) => ({ ...f, category: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "katalog.category.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-price", children: "Base Price (Rp) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "s-price",
              "data-ocid": "katalog.price.input",
              type: "number",
              value: form.basePrice,
              onChange: (e) => setForm((f) => ({ ...f, basePrice: e.target.value })),
              placeholder: "0",
              className: "mt-1"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "katalog.cancel_button",
            variant: "outline",
            onClick: () => setFormOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "katalog.submit_button",
            onClick: handleSubmit,
            disabled: isPending,
            children: isPending ? "Saving..." : editService ? "Save" : "Add"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "katalog.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Service?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The service will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "katalog.cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            "data-ocid": "katalog.confirm_button",
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
  KatalogLayananPage as default
};
