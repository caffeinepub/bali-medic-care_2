import { d as createLucideIcon, a as useGetServices, n as useCreateService, o as useUpdateService, p as useDeleteService, r as reactExports, j as jsxRuntimeExports, B as Button, c as ue } from "./index-DyL3gOAQ.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-COKx9z3I.js";
import { C as Card, c as CardContent } from "./card-xuZxmpC-.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-EvFKn-os.js";
import { P as Plus, I as Input } from "./Combination-RxT-5ZDg.js";
import { L as Label } from "./label-RqSgi2UX.js";
import { S as Skeleton } from "./skeleton-C53PxwGh.js";
import { F as FileSpreadsheet, e as exportToExcel } from "./exportExcel-FmF2Z34x.js";
import { f as formatRupiah } from "./formatters-DRYxEYqJ.js";
import { P as Pencil } from "./pencil-CFUv7zJS.js";
import { T as Trash2 } from "./trash-2-C8ShOvDJ.js";
import "./index-Bk2maIQh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 10v6", key: "1bos4e" }],
  ["path", { d: "M9 13h6", key: "1uhe8q" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const FolderPlus = createLucideIcon("folder-plus", __iconNode);
const DEFAULT_CATEGORIES = [
  "TINDAKAN",
  "OBAT",
  "LABORATORIUM",
  "KONSULTASI",
  "LAINNYA"
];
const emptyForm = {
  name: "",
  category: "",
  basePrice: ""
};
const categoryColors = {
  TINDAKAN: "bg-blue-50 text-blue-700",
  OBAT: "bg-green-50 text-green-700",
  LABORATORIUM: "bg-purple-50 text-purple-700",
  KONSULTASI: "bg-amber-50 text-amber-700",
  LAINNYA: "bg-gray-100 text-gray-700"
};
function loadCustomCategories() {
  try {
    const raw = localStorage.getItem("customCategories");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCustomCategories(cats) {
  localStorage.setItem("customCategories", JSON.stringify(cats));
}
function KatalogLayananPage() {
  const { data: services, isLoading } = useGetServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editService, setEditService] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [customCategories, setCustomCategories] = reactExports.useState(loadCustomCategories);
  const [catDialogOpen, setCatDialogOpen] = reactExports.useState(false);
  const [catForm, setCatForm] = reactExports.useState({ name: "", defaultPrice: "" });
  const [showCatDropdown, setShowCatDropdown] = reactExports.useState(false);
  const catInputRef = reactExports.useRef(null);
  const catDropdownRef = reactExports.useRef(null);
  const allCategories = [
    ...DEFAULT_CATEGORIES.map((name) => ({ name, defaultPrice: 0 })),
    ...customCategories
  ];
  const filteredCatSuggestions = form.category ? allCategories.filter(
    (c) => c.name.toLowerCase().includes(form.category.toLowerCase())
  ) : allCategories;
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(e.target) && catInputRef.current && !catInputRef.current.contains(e.target)) {
        setShowCatDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
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
  const handleCategorySelect = (cat) => {
    setForm((f) => ({
      ...f,
      category: cat.name,
      basePrice: cat.defaultPrice > 0 && !f.basePrice ? String(cat.defaultPrice) : f.basePrice
    }));
    setShowCatDropdown(false);
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
          category: form.category || "LAINNYA",
          basePrice: price
        });
        ue.success("Service updated");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          category: form.category || "LAINNYA",
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
  const handleSaveCategory = () => {
    const name = catForm.name.trim().toUpperCase();
    if (!name) {
      ue.error("Category name is required");
      return;
    }
    const already = allCategories.some((c) => c.name === name);
    if (already) {
      ue.error("Category already exists");
      return;
    }
    const newCat = {
      name,
      defaultPrice: Number(catForm.defaultPrice) || 0
    };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    saveCustomCategories(updated);
    setCatForm({ name: "", defaultPrice: "" });
    setCatDialogOpen(false);
    ue.success(`Category "${name}" added`);
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Service Catalog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage clinic services and procedures" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "katalog.category.open_modal_button",
            variant: "outline",
            onClick: () => {
              setCatForm({ name: "", defaultPrice: "" });
              setCatDialogOpen(true);
            },
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "w-4 h-4" }),
              "Add Category"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "service-catalog.export_button",
            variant: "outline",
            onClick: () => {
              const rows = (services ?? []).map((s) => ({
                Name: s.name,
                Category: s.category,
                "Base Price (IDR)": Number(s.basePrice)
              }));
              exportToExcel(rows, "service-catalog");
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
            "data-ocid": "katalog.open_modal_button",
            onClick: openCreate,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Add Service"
            ]
          }
        )
      ] })
    ] }),
    customCategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground self-center", children: "Custom categories:" }),
      customCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium",
          children: [
            cat.name,
            cat.defaultPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400 font-normal", children: formatRupiah(BigInt(cat.defaultPrice)) })
          ]
        },
        cat.name
      ))
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-category", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-category",
                ref: catInputRef,
                "data-ocid": "katalog.category.input",
                value: form.category,
                onChange: (e) => {
                  setForm((f) => ({ ...f, category: e.target.value }));
                  setShowCatDropdown(true);
                },
                onFocus: () => setShowCatDropdown(true),
                placeholder: "Select or type a category",
                autoComplete: "off"
              }
            ),
            showCatDropdown && filteredCatSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: catDropdownRef,
                className: "absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto",
                children: filteredCatSuggestions.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2",
                    onMouseDown: (e) => {
                      e.preventDefault();
                      handleCategorySelect(cat);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `text-xs px-2 py-0.5 rounded font-medium ${categoryColors[cat.name] ?? "bg-gray-100 text-gray-700"}`,
                          children: cat.name
                        }
                      ),
                      cat.defaultPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatRupiah(BigInt(cat.defaultPrice)) })
                    ]
                  },
                  cat.name
                ))
              }
            )
          ] })
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: catDialogOpen, onOpenChange: setCatDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "sm:max-w-sm",
        "data-ocid": "katalog.category.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add New Category" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cat-name", children: "Category Name *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cat-name",
                  "data-ocid": "katalog.category.name.input",
                  value: catForm.name,
                  onChange: (e) => setCatForm((f) => ({ ...f, name: e.target.value })),
                  placeholder: "e.g. FISIOTERAPI",
                  className: "mt-1"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cat-price", children: "Default Price (Rp)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cat-price",
                  "data-ocid": "katalog.category.price.input",
                  type: "number",
                  value: catForm.defaultPrice,
                  onChange: (e) => setCatForm((f) => ({ ...f, defaultPrice: e.target.value })),
                  placeholder: "0 (optional)",
                  className: "mt-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "If set, this price will be auto-filled when you select this category for a service." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "katalog.category.cancel_button",
                variant: "outline",
                onClick: () => setCatDialogOpen(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "katalog.category.save_button",
                onClick: handleSaveCategory,
                children: "Save Category"
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "katalog.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Service?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "The service will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "katalog.delete.cancel_button", children: "Cancel" }),
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
