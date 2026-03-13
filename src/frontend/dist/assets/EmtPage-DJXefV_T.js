import { r as reactExports, j as jsxRuntimeExports, B as Button, A as Ambulance, c as ue } from "./index-DyL3gOAQ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-COKx9z3I.js";
import { B as Badge } from "./badge-D99FEj8n.js";
import { C as Card, c as CardContent } from "./card-xuZxmpC-.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-EvFKn-os.js";
import { P as Plus, I as Input } from "./Combination-RxT-5ZDg.js";
import { L as Label } from "./label-RqSgi2UX.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-mTwswc-Y.js";
import { F as FileSpreadsheet, e as exportToExcel } from "./exportExcel-FmF2Z34x.js";
import { S as Search } from "./search-CB94ecWd.js";
import { P as Pencil } from "./pencil-CFUv7zJS.js";
import { T as Trash2 } from "./trash-2-C8ShOvDJ.js";
import "./index-Bk2maIQh.js";
import "./index-4zXjPPiL.js";
const STORAGE_KEY = "emtData";
const emptyForm = {
  name: "",
  certificationLevel: "EMT-Basic",
  phone: "",
  status: "Active"
};
function loadEmts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveEmts(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function generateEmtNo(existing) {
  const nums = existing.map((e) => Number.parseInt(e.emtNo.replace("EMT-", ""), 10)).filter((n) => !Number.isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `EMT-${String(next).padStart(3, "0")}`;
}
function EmtPage() {
  const [emts, setEmts] = reactExports.useState(loadEmts);
  const [search, setSearch] = reactExports.useState("");
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editEmt, setEditEmt] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  reactExports.useEffect(() => {
    saveEmts(emts);
  }, [emts]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return emts;
    return emts.filter(
      (e) => e.name.toLowerCase().includes(q) || e.emtNo.toLowerCase().includes(q)
    );
  }, [emts, search]);
  const openCreate = () => {
    setEditEmt(null);
    setForm(emptyForm);
    setFormOpen(true);
  };
  const openEdit = (e) => {
    setEditEmt(e);
    setForm({
      name: e.name,
      certificationLevel: e.certificationLevel,
      phone: e.phone,
      status: e.status
    });
    setFormOpen(true);
  };
  const handleSubmit = () => {
    if (!form.name.trim()) {
      ue.error("EMT name is required");
      return;
    }
    if (editEmt) {
      setEmts(
        (prev) => prev.map((e) => e.id === editEmt.id ? { ...e, ...form } : e)
      );
      ue.success("EMT record updated");
    } else {
      const newEmt = {
        id: crypto.randomUUID(),
        emtNo: generateEmtNo(emts),
        ...form
      };
      setEmts((prev) => [...prev, newEmt]);
      ue.success("New EMT added");
    }
    setFormOpen(false);
  };
  const handleDelete = () => {
    if (!deleteId) return;
    setEmts((prev) => prev.filter((e) => e.id !== deleteId));
    ue.success("EMT record deleted");
    setDeleteId(null);
  };
  const certColors = {
    "EMT-Basic": "bg-blue-100 text-blue-700",
    "EMT-Intermediate": "bg-purple-100 text-purple-700",
    AEMT: "bg-amber-100 text-amber-700",
    Paramedic: "bg-red-100 text-red-700"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Emergency Medical Technicians" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage EMT staff records and certifications" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "emt-records.export_button",
            variant: "outline",
            onClick: () => {
              const rows = emts.map((e) => ({
                "EMT No": e.emtNo,
                Name: e.name,
                "Certification Level": e.certificationLevel,
                Phone: e.phone,
                Status: e.status
              }));
              exportToExcel(rows, "emt-records");
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
            "data-ocid": "emt.open_modal_button",
            onClick: openCreate,
            className: "gap-2 shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Add EMT"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "emt.search_input",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search by name or EMT number...",
          className: "pl-9"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "emt.empty_state",
        className: "text-center py-12 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Ambulance, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "No EMT records match your search" : "No EMT records yet" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "EMT No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Certification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((e, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `emt.row.${idx + 1}`,
          className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: e.emtNo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: e.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${certColors[e.certificationLevel]}`,
                children: e.certificationLevel
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: e.phone || "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: e.status === "Active" ? "default" : "secondary",
                className: e.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-100" : "",
                children: e.status
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `emt.edit_button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: () => openEdit(e),
                  className: "h-8 w-8 p-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `emt.delete_button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setDeleteId(e.id),
                  className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ] }) })
          ]
        },
        e.id
      )) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: formOpen, onOpenChange: setFormOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "emt.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editEmt ? "Edit EMT" : "Add New EMT" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "emt-name", children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "emt-name",
              "data-ocid": "emt.input",
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              placeholder: "Full name",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "emt-cert", children: "Certification Level" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.certificationLevel,
              onValueChange: (v) => setForm((f) => ({
                ...f,
                certificationLevel: v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "emt-cert",
                    "data-ocid": "emt.certification.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EMT-Basic", children: "EMT-Basic" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "EMT-Intermediate", children: "EMT-Intermediate" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AEMT", children: "AEMT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Paramedic", children: "Paramedic" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "emt-phone", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "emt-phone",
              "data-ocid": "emt.phone.input",
              value: form.phone,
              onChange: (e) => setForm((f) => ({ ...f, phone: e.target.value })),
              placeholder: "Phone number",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "emt-status", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.status,
              onValueChange: (v) => setForm((f) => ({ ...f, status: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "emt-status",
                    "data-ocid": "emt.status.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Active", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Inactive", children: "Inactive" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "emt.cancel_button",
            variant: "outline",
            onClick: () => setFormOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { "data-ocid": "emt.submit_button", onClick: handleSubmit, children: editEmt ? "Save" : "Add" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "emt.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete EMT Record?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This EMT record will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "emt.cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            "data-ocid": "emt.confirm_button",
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
  EmtPage as default
};
