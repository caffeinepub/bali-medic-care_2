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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Gender } from "../backend.d";
import {
  useCreatePatient,
  useDeletePatient,
  useGetPatients,
  useUpdatePatient,
} from "../hooks/useQueries";
import type { Patient } from "../hooks/useQueries";
import {
  dateToBigIntNanos,
  formatDate,
  nanosToDateInput,
} from "../utils/formatters";

interface PatientForm {
  name: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  phone: string;
}

const emptyForm: PatientForm = {
  name: "",
  dateOfBirth: "",
  gender: "male",
  address: "",
  phone: "",
};

export default function PasienPage() {
  const { data: patients, isLoading } = useGetPatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<PatientForm>(emptyForm);

  const filtered = (patients ?? []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientNo.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  );

  const openCreate = () => {
    setEditPatient(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setForm({
      name: p.name,
      dateOfBirth: nanosToDateInput(p.dateOfBirth),
      gender: p.gender as "male" | "female" | "other",
      address: p.address,
      phone: p.phone,
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.dateOfBirth) {
      toast.error("Nama dan tanggal lahir wajib diisi");
      return;
    }
    const genderEnum =
      form.gender === "male"
        ? Gender.male
        : form.gender === "female"
          ? Gender.female
          : Gender.other;
    try {
      if (editPatient) {
        await updateMutation.mutateAsync({
          id: editPatient.id,
          name: form.name,
          dateOfBirth: dateToBigIntNanos(form.dateOfBirth),
          gender: genderEnum,
          address: form.address,
          phone: form.phone,
        });
        toast.success("Data pasien diperbarui");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          dateOfBirth: dateToBigIntNanos(form.dateOfBirth),
          gender: genderEnum,
          address: form.address,
          phone: form.phone,
        });
        toast.success("Pasien baru ditambahkan");
      }
      setFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan data pasien");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Pasien dihapus");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus pasien");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Pasien
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola data pasien klinik
          </p>
        </div>
        <Button
          data-ocid="pasien.open_modal_button"
          onClick={openCreate}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pasien
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="pasien.search_input"
          placeholder="Cari nama, nomor pasien, atau telepon..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setSearch("")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="pasien.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-sm">
                {search ? "Pasien tidak ditemukan" : "Belum ada data pasien"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      No. Pasien
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Nama
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Tgl Lahir
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Jenis Kelamin
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Telepon
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => (
                    <tr
                      key={String(p.id)}
                      data-ocid={`pasien.row.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                          {p.patientNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {formatDate(p.dateOfBirth)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge
                          variant={
                            p.gender === "male" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {p.gender === "male"
                            ? "Laki-laki"
                            : p.gender === "female"
                              ? "Perempuan"
                              : "Lainnya"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {p.phone}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            data-ocid={`pasien.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(p)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`pasien.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(p.id)}
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
        <DialogContent className="sm:max-w-md" data-ocid="pasien.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editPatient ? "Edit Data Pasien" : "Tambah Pasien Baru"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                data-ocid="pasien.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nama lengkap pasien"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dob">Tanggal Lahir *</Label>
              <Input
                id="dob"
                type="date"
                data-ocid="pasien.dob.input"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Jenis Kelamin</Label>
              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    gender: v as "male" | "female" | "other",
                  }))
                }
              >
                <SelectTrigger
                  data-ocid="pasien.gender.select"
                  className="mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                data-ocid="pasien.address.input"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="Alamat lengkap"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                data-ocid="pasien.phone.input"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="Nomor telepon"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="pasien.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Batal
            </Button>
            <Button
              data-ocid="pasien.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending
                ? "Menyimpan..."
                : editPatient
                  ? "Simpan Perubahan"
                  : "Tambah Pasien"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="pasien.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Pasien?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pasien akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="pasien.cancel_button">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="pasien.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
