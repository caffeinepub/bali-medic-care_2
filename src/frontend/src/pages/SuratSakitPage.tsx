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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateSickNote,
  useDeleteSickNote,
  useGetDoctors,
  useGetPatients,
  useGetSickNotes,
} from "../hooks/useQueries";
import {
  calcDaysBetween,
  dateToBigIntNanos,
  formatDate,
  todayInputValue,
} from "../utils/formatters";

interface Props {
  onPrint: (id: bigint) => void;
}

interface SickNoteForm {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  startDate: string;
  endDate: string;
  issuedDate: string;
  notes: string;
}

const emptyForm = (): SickNoteForm => ({
  patientId: "",
  doctorId: "",
  diagnosis: "",
  startDate: todayInputValue(),
  endDate: todayInputValue(),
  issuedDate: todayInputValue(),
  notes: "",
});

export default function SuratSakitPage({ onPrint }: Props) {
  const { data: notes, isLoading } = useGetSickNotes();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const createMutation = useCreateSickNote();
  const deleteMutation = useDeleteSickNote();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<SickNoteForm>(emptyForm());

  const restDays = calcDaysBetween(form.startDate, form.endDate);

  const openCreate = () => {
    setForm(emptyForm());
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.patientId || !form.doctorId || !form.diagnosis) {
      toast.error("Patient, doctor, and diagnosis are required");
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
        notes: form.notes,
      });
      toast.success("Sick Note created");
      setFormOpen(false);
    } catch {
      toast.error("Failed to create sick note");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Document deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete document");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Sick Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage patient sick notes
          </p>
        </div>
        <Button
          data-ocid="surat-sakit.open_modal_button"
          onClick={openCreate}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Sick Note
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (notes ?? []).length === 0 ? (
            <div
              data-ocid="surat-sakit.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-sm">No sick notes yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Doctor
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Diagnosis
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Period
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Rest Days
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Issued Date
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(notes ?? []).map((note, idx) => {
                    const patient = patients?.find(
                      (p) => p.id === note.patientId,
                    );
                    const doctor = doctors?.find((d) => d.id === note.doctorId);
                    return (
                      <tr
                        key={String(note.id)}
                        data-ocid={`surat-sakit.row.${idx + 1}`}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {patient?.name ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {doctor?.name ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[180px] truncate">
                          {note.diagnosis}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                          {formatDate(note.startDate)} –{" "}
                          {formatDate(note.endDate)}
                        </td>
                        <td className="px-4 py-3 text-center font-medium hidden md:table-cell">
                          {String(note.restDays)} days
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(note.issuedDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`surat-sakit.print.button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => onPrint(note.id)}
                              className="h-8 w-8 p-0 text-primary"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`surat-sakit.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(note.id)}
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg" data-ocid="surat-sakit.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Create Sick Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label>Patient *</Label>
              <Select
                value={form.patientId}
                onValueChange={(v) => setForm((f) => ({ ...f, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="surat-sakit.patient.select"
                  className="mt-1"
                >
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {(patients ?? []).map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name} ({p.patientNo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Doctor *</Label>
              <Select
                value={form.doctorId}
                onValueChange={(v) => setForm((f) => ({ ...f, doctorId: v }))}
              >
                <SelectTrigger
                  data-ocid="surat-sakit.doctor.select"
                  className="mt-1"
                >
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {(doctors ?? []).map((d) => (
                    <SelectItem key={String(d.id)} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Input
                id="diagnosis"
                data-ocid="surat-sakit.diagnosis.input"
                value={form.diagnosis}
                onChange={(e) =>
                  setForm((f) => ({ ...f, diagnosis: e.target.value }))
                }
                placeholder="Medical diagnosis"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  data-ocid="surat-sakit.start_date.input"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  data-ocid="surat-sakit.end_date.input"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm">
              <span className="text-muted-foreground">Rest period: </span>
              <span className="font-semibold text-foreground">
                {restDays} days
              </span>
            </div>
            <div>
              <Label htmlFor="issuedDate">Issue Date</Label>
              <Input
                id="issuedDate"
                type="date"
                data-ocid="surat-sakit.issued_date.input"
                value={form.issuedDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, issuedDate: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                data-ocid="surat-sakit.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Notes for patient (optional)"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="surat-sakit.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="surat-sakit.submit_button"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Create Sick Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="surat-sakit.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sick Note?</AlertDialogTitle>
            <AlertDialogDescription>
              The document will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="surat-sakit.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="surat-sakit.confirm_button"
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
