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
import { exportToExcel } from "@/lib/exportExcel";
import { FileSpreadsheet, Plus, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateHealthCertificate,
  useDeleteHealthCertificate,
  useGetDoctors,
  useGetHealthCertificates,
  useGetPatients,
} from "../hooks/useQueries";
import {
  dateToBigIntNanos,
  formatDate,
  todayInputValue,
} from "../utils/formatters";

interface Props {
  onPrint: (id: bigint) => void;
}

interface HealthCertForm {
  patientId: string;
  doctorId: string;
  purpose: string;
  issuedDate: string;
  notes: string;
  bloodPressure: string;
  pulse: string;
  weight: string;
  height: string;
}

const emptyForm = (): HealthCertForm => ({
  patientId: "",
  doctorId: "",
  purpose: "",
  issuedDate: todayInputValue(),
  notes: "",
  bloodPressure: "",
  pulse: "",
  weight: "",
  height: "",
});

export default function SuratSehatPage({ onPrint }: Props) {
  const { data: certs, isLoading } = useGetHealthCertificates();
  const { data: patients } = useGetPatients();
  const { data: doctors } = useGetDoctors();
  const createMutation = useCreateHealthCertificate();
  const deleteMutation = useDeleteHealthCertificate();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<HealthCertForm>(emptyForm());

  const openCreate = () => {
    setForm(emptyForm());
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.patientId || !form.doctorId || !form.purpose) {
      toast.error("Patient, doctor, and purpose are required");
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
        height: BigInt(Number.parseInt(form.height) || 0),
      });
      toast.success("Health Certificate created");
      setFormOpen(false);
    } catch {
      toast.error("Failed to create health certificate");
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
            Health Certificates
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage patient health certificates
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="healthy-certificates.export_button"
            variant="outline"
            onClick={() => {
              const rows = (certs ?? []).map((c) => {
                const patient = patients?.find((p) => p.id === c.patientId);
                const doctor = doctors?.find((dd) => dd.id === c.doctorId);
                return {
                  Patient: patient?.name ?? String(c.patientId),
                  Doctor: doctor?.name ?? String(c.doctorId),
                  Purpose: c.purpose,
                  "Issued Date": new Date(
                    Number(c.issuedDate / BigInt(1_000_000)),
                  ).toLocaleDateString(),
                  "Blood Pressure": c.bloodPressure,
                  Pulse: Number(c.pulse),
                  "Weight (kg)": Number(c.weight),
                  "Height (cm)": Number(c.height),
                  Notes: c.notes,
                };
              });
              exportToExcel(rows, "healthy-certificates");
            }}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </Button>
          <Button
            data-ocid="surat-sehat.open_modal_button"
            onClick={openCreate}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Certificate
          </Button>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (certs ?? []).length === 0 ? (
            <div
              data-ocid="surat-sehat.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-sm">No health certificates yet</p>
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
                      Purpose
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
                  {(certs ?? []).map((cert, idx) => {
                    const patient = patients?.find(
                      (p) => p.id === cert.patientId,
                    );
                    const doctor = doctors?.find((d) => d.id === cert.doctorId);
                    return (
                      <tr
                        key={String(cert.id)}
                        data-ocid={`surat-sehat.row.${idx + 1}`}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          {patient?.name ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {doctor?.name ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[180px] truncate">
                          {cert.purpose}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(cert.issuedDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`surat-sehat.print.button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => onPrint(cert.id)}
                              className="h-8 w-8 p-0 text-primary"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`surat-sehat.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(cert.id)}
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
        <DialogContent className="sm:max-w-lg" data-ocid="surat-sehat.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Create Health Certificate
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label>Patient *</Label>
              <Select
                value={form.patientId}
                onValueChange={(v) => setForm((f) => ({ ...f, patientId: v }))}
              >
                <SelectTrigger
                  data-ocid="surat-sehat.patient.select"
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
                  data-ocid="surat-sehat.doctor.select"
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
              <Label htmlFor="purpose">Purpose *</Label>
              <Input
                id="purpose"
                data-ocid="surat-sehat.purpose.input"
                value={form.purpose}
                onChange={(e) =>
                  setForm((f) => ({ ...f, purpose: e.target.value }))
                }
                placeholder="e.g. Employment, civil service exam, etc."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bp">Blood Pressure</Label>
                <Input
                  id="bp"
                  data-ocid="surat-sehat.blood_pressure.input"
                  value={form.bloodPressure}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bloodPressure: e.target.value }))
                  }
                  placeholder="120/80 mmHg"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  type="number"
                  data-ocid="surat-sehat.pulse.input"
                  value={form.pulse}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pulse: e.target.value }))
                  }
                  placeholder="80"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  data-ocid="surat-sehat.weight.input"
                  value={form.weight}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, weight: e.target.value }))
                  }
                  placeholder="60"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  data-ocid="surat-sehat.height.input"
                  value={form.height}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, height: e.target.value }))
                  }
                  placeholder="165"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="issuedDate">Issue Date</Label>
              <Input
                id="issuedDate"
                type="date"
                data-ocid="surat-sehat.issued_date.input"
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
                data-ocid="surat-sehat.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Additional notes (optional)"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="surat-sehat.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="surat-sehat.submit_button"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Create Certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="surat-sehat.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Health Certificate?</AlertDialogTitle>
            <AlertDialogDescription>
              The document will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="surat-sehat.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="surat-sehat.confirm_button"
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
