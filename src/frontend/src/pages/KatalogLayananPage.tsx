import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel } from "@/lib/exportExcel";
import {
  FileSpreadsheet,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useCreateService,
  useDeleteService,
  useGetServices,
  useUpdateService,
} from "../hooks/useQueries";
import type { ServiceCatalog } from "../hooks/useQueries";
import { formatRupiah } from "../utils/formatters";

const DEFAULT_CATEGORIES = [
  "TINDAKAN",
  "OBAT",
  "LABORATORIUM",
  "KONSULTASI",
  "LAINNYA",
];

interface CustomCategory {
  name: string;
  defaultPrice: number;
}

interface ServiceForm {
  name: string;
  category: string;
  basePrice: string;
}

const emptyForm: ServiceForm = {
  name: "",
  category: "",
  basePrice: "",
};

const categoryColors: Record<string, string> = {
  TINDAKAN: "bg-blue-50 text-blue-700",
  OBAT: "bg-green-50 text-green-700",
  LABORATORIUM: "bg-purple-50 text-purple-700",
  KONSULTASI: "bg-amber-50 text-amber-700",
  LAINNYA: "bg-gray-100 text-gray-700",
};

function loadCustomCategories(): CustomCategory[] {
  try {
    const raw = localStorage.getItem("customCategories");
    return raw ? (JSON.parse(raw) as CustomCategory[]) : [];
  } catch {
    return [];
  }
}

function saveCustomCategories(cats: CustomCategory[]) {
  localStorage.setItem("customCategories", JSON.stringify(cats));
}

export default function KatalogLayananPage() {
  const { data: services, isLoading } = useGetServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [formOpen, setFormOpen] = useState(false);
  const [editService, setEditService] = useState<ServiceCatalog | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  // Custom categories
  const [customCategories, setCustomCategories] =
    useState<CustomCategory[]>(loadCustomCategories);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", defaultPrice: "" });
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const catInputRef = useRef<HTMLInputElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);

  const allCategories = [
    ...DEFAULT_CATEGORIES.map((name) => ({ name, defaultPrice: 0 })),
    ...customCategories,
  ];

  const filteredCatSuggestions = form.category
    ? allCategories.filter((c) =>
        c.name.toLowerCase().includes(form.category.toLowerCase()),
      )
    : allCategories;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        catDropdownRef.current &&
        !catDropdownRef.current.contains(e.target as Node) &&
        catInputRef.current &&
        !catInputRef.current.contains(e.target as Node)
      ) {
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

  const openEdit = (s: ServiceCatalog) => {
    setEditService(s);
    setForm({
      name: s.name,
      category: s.category,
      basePrice: String(s.basePrice),
    });
    setFormOpen(true);
  };

  const handleCategorySelect = (cat: CustomCategory) => {
    setForm((f) => ({
      ...f,
      category: cat.name,
      basePrice:
        cat.defaultPrice > 0 && !f.basePrice
          ? String(cat.defaultPrice)
          : f.basePrice,
    }));
    setShowCatDropdown(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.basePrice) {
      toast.error("Name and price are required");
      return;
    }
    const price = BigInt(
      Math.round(
        Number.parseFloat(form.basePrice.replace(/[^0-9.]/g, "")) || 0,
      ),
    );
    try {
      if (editService) {
        await updateMutation.mutateAsync({
          id: editService.id,
          name: form.name,
          category: form.category || "LAINNYA",
          basePrice: price,
        });
        toast.success("Service updated");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          category: form.category || "LAINNYA",
          basePrice: price,
        });
        toast.success("New service added");
      }
      setFormOpen(false);
    } catch {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Service deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const handleSaveCategory = () => {
    const name = catForm.name.trim().toUpperCase();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    const already = allCategories.some((c) => c.name === name);
    if (already) {
      toast.error("Category already exists");
      return;
    }
    const newCat: CustomCategory = {
      name,
      defaultPrice: Number(catForm.defaultPrice) || 0,
    };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    saveCustomCategories(updated);
    setCatForm({ name: "", defaultPrice: "" });
    setCatDialogOpen(false);
    toast.success(`Category "${name}" added`);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Service Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage clinic services and procedures
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="katalog.category.open_modal_button"
            variant="outline"
            onClick={() => {
              setCatForm({ name: "", defaultPrice: "" });
              setCatDialogOpen(true);
            }}
            className="gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Add Category
          </Button>
          <Button
            data-ocid="service-catalog.export_button"
            variant="outline"
            onClick={() => {
              const rows = (services ?? []).map((s) => ({
                Name: s.name,
                Category: s.category,
                "Base Price (IDR)": Number(s.basePrice),
              }));
              exportToExcel(rows, "service-catalog");
            }}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </Button>
          <Button
            data-ocid="katalog.open_modal_button"
            onClick={openCreate}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Custom categories badges */}
      {customCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">
            Custom categories:
          </span>
          {customCategories.map((cat) => (
            <span
              key={cat.name}
              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium"
            >
              {cat.name}
              {cat.defaultPrice > 0 && (
                <span className="text-gray-400 font-normal">
                  {formatRupiah(BigInt(cat.defaultPrice))}
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (services ?? []).length === 0 ? (
            <div
              data-ocid="katalog.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-sm">No services registered yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Service Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Base Price
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(services ?? []).map((s, idx) => (
                    <tr
                      key={String(s.id)}
                      data-ocid={`katalog.row.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            categoryColors[s.category] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {s.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatRupiah(s.basePrice)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            data-ocid={`katalog.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(s)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`katalog.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(s.id)}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="katalog.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="s-name">Service Name *</Label>
              <Input
                id="s-name"
                data-ocid="katalog.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Service name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="s-category">Category</Label>
              <div className="relative mt-1">
                <Input
                  id="s-category"
                  ref={catInputRef}
                  data-ocid="katalog.category.input"
                  value={form.category}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, category: e.target.value }));
                    setShowCatDropdown(true);
                  }}
                  onFocus={() => setShowCatDropdown(true)}
                  placeholder="Select or type a category"
                  autoComplete="off"
                />
                {showCatDropdown && filteredCatSuggestions.length > 0 && (
                  <div
                    ref={catDropdownRef}
                    className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
                  >
                    {filteredCatSuggestions.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleCategorySelect(cat);
                        }}
                      >
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            categoryColors[cat.name] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {cat.name}
                        </span>
                        {cat.defaultPrice > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatRupiah(BigInt(cat.defaultPrice))}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="s-price">Base Price (Rp) *</Label>
              <Input
                id="s-price"
                data-ocid="katalog.price.input"
                type="number"
                value={form.basePrice}
                onChange={(e) =>
                  setForm((f) => ({ ...f, basePrice: e.target.value }))
                }
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="katalog.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="katalog.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Saving..." : editService ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent
          className="sm:max-w-sm"
          data-ocid="katalog.category.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input
                id="cat-name"
                data-ocid="katalog.category.name.input"
                value={catForm.name}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. FISIOTERAPI"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cat-price">Default Price (Rp)</Label>
              <Input
                id="cat-price"
                data-ocid="katalog.category.price.input"
                type="number"
                value={catForm.defaultPrice}
                onChange={(e) =>
                  setCatForm((f) => ({ ...f, defaultPrice: e.target.value }))
                }
                placeholder="0 (optional)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                If set, this price will be auto-filled when you select this
                category for a service.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="katalog.category.cancel_button"
              variant="outline"
              onClick={() => setCatDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="katalog.category.save_button"
              onClick={handleSaveCategory}
            >
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="katalog.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service?</AlertDialogTitle>
            <AlertDialogDescription>
              The service will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="katalog.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="katalog.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
