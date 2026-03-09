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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateService,
  useDeleteService,
  useGetServices,
  useUpdateService,
} from "../hooks/useQueries";
import type { ServiceCatalog } from "../hooks/useQueries";
import { formatRupiah } from "../utils/formatters";

const CATEGORIES = [
  "TINDAKAN",
  "OBAT",
  "LABORATORIUM",
  "KONSULTASI",
  "LAINNYA",
];

interface ServiceForm {
  name: string;
  category: string;
  basePrice: string;
}

const emptyForm: ServiceForm = {
  name: "",
  category: "TINDAKAN",
  basePrice: "",
};

const categoryColors: Record<string, string> = {
  TINDAKAN: "bg-blue-50 text-blue-700",
  OBAT: "bg-green-50 text-green-700",
  LABORATORIUM: "bg-purple-50 text-purple-700",
  KONSULTASI: "bg-amber-50 text-amber-700",
  LAINNYA: "bg-gray-100 text-gray-700",
};

export default function KatalogLayananPage() {
  const { data: services, isLoading } = useGetServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [formOpen, setFormOpen] = useState(false);
  const [editService, setEditService] = useState<ServiceCatalog | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

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
          category: form.category,
          basePrice: price,
        });
        toast.success("Service updated");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          category: form.category,
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Service Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage clinic services and procedures
          </p>
        </div>
        <Button
          data-ocid="katalog.open_modal_button"
          onClick={openCreate}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

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
                          className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColors[s.category] ?? "bg-gray-100 text-gray-700"}`}
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

      {/* Form Dialog */}
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
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  data-ocid="katalog.category.select"
                  className="mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <AlertDialogCancel data-ocid="katalog.cancel_button">
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
