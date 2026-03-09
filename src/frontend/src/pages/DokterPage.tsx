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
import { Pencil, Plus, Stethoscope, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateDoctor,
  useDeleteDoctor,
  useGetDoctors,
  useUpdateDoctor,
} from "../hooks/useQueries";
import type { Doctor } from "../hooks/useQueries";

interface DoctorForm {
  name: string;
  specialization: string;
  phone: string;
}

const emptyForm: DoctorForm = { name: "", specialization: "", phone: "" };

export default function DokterPage() {
  const { data: doctors, isLoading } = useGetDoctors();
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const deleteMutation = useDeleteDoctor();

  const [formOpen, setFormOpen] = useState(false);
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);

  const openCreate = () => {
    setEditDoctor(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (d: Doctor) => {
    setEditDoctor(d);
    setForm({ name: d.name, specialization: d.specialization, phone: d.phone });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error("Doctor name is required");
      return;
    }
    try {
      if (editDoctor) {
        await updateMutation.mutateAsync({ id: editDoctor.id, ...form });
        toast.success("Doctor updated");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("New doctor added");
      }
      setFormOpen(false);
    } catch {
      toast.error("Failed to save doctor");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Doctor deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Doctors
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage clinic doctor records
          </p>
        </div>
        <Button
          data-ocid="dokter.open_modal_button"
          onClick={openCreate}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Doctor
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (doctors ?? []).length === 0 ? (
            <div
              data-ocid="dokter.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No doctor records yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Specialization
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Phone
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(doctors ?? []).map((d, idx) => (
                    <tr
                      key={String(d.id)}
                      data-ocid={`dokter.row.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{d.name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {d.specialization}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {d.phone}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            data-ocid={`dokter.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(d)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`dokter.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(d.id)}
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
        <DialogContent className="sm:max-w-md" data-ocid="dokter.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editDoctor ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="d-name">Doctor Name *</Label>
              <Input
                id="d-name"
                data-ocid="dokter.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="d-spec">Specialization</Label>
              <Input
                id="d-spec"
                data-ocid="dokter.specialization.input"
                value={form.specialization}
                onChange={(e) =>
                  setForm((f) => ({ ...f, specialization: e.target.value }))
                }
                placeholder="e.g. General Practitioner"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="d-phone">Phone</Label>
              <Input
                id="d-phone"
                data-ocid="dokter.phone.input"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="Phone number"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="dokter.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="dokter.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Saving..." : editDoctor ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="dokter.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Doctor?</AlertDialogTitle>
            <AlertDialogDescription>
              The doctor record will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="dokter.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="dokter.confirm_button"
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
