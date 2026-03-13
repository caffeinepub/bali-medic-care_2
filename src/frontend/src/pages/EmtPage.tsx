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
import { exportToExcel } from "@/lib/exportExcel";
import {
  Ambulance,
  FileSpreadsheet,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type CertificationLevel =
  | "EMT-Basic"
  | "EMT-Intermediate"
  | "AEMT"
  | "Paramedic";
type StatusType = "Active" | "Inactive";

interface EmtRecord {
  id: string;
  emtNo: string;
  name: string;
  certificationLevel: CertificationLevel;
  phone: string;
  status: StatusType;
}

interface EmtForm {
  name: string;
  certificationLevel: CertificationLevel;
  phone: string;
  status: StatusType;
}

const STORAGE_KEY = "emtData";
const emptyForm: EmtForm = {
  name: "",
  certificationLevel: "EMT-Basic",
  phone: "",
  status: "Active",
};

function loadEmts(): EmtRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEmts(data: EmtRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateEmtNo(existing: EmtRecord[]): string {
  const nums = existing
    .map((e) => Number.parseInt(e.emtNo.replace("EMT-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  return `EMT-${String(next).padStart(3, "0")}`;
}

export default function EmtPage() {
  const [emts, setEmts] = useState<EmtRecord[]>(loadEmts);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editEmt, setEditEmt] = useState<EmtRecord | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<EmtForm>(emptyForm);

  useEffect(() => {
    saveEmts(emts);
  }, [emts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return emts;
    return emts.filter(
      (e) =>
        e.name.toLowerCase().includes(q) || e.emtNo.toLowerCase().includes(q),
    );
  }, [emts, search]);

  const openCreate = () => {
    setEditEmt(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (e: EmtRecord) => {
    setEditEmt(e);
    setForm({
      name: e.name,
      certificationLevel: e.certificationLevel,
      phone: e.phone,
      status: e.status,
    });
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("EMT name is required");
      return;
    }
    if (editEmt) {
      setEmts((prev) =>
        prev.map((e) => (e.id === editEmt.id ? { ...e, ...form } : e)),
      );
      toast.success("EMT record updated");
    } else {
      const newEmt: EmtRecord = {
        id: crypto.randomUUID(),
        emtNo: generateEmtNo(emts),
        ...form,
      };
      setEmts((prev) => [...prev, newEmt]);
      toast.success("New EMT added");
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setEmts((prev) => prev.filter((e) => e.id !== deleteId));
    toast.success("EMT record deleted");
    setDeleteId(null);
  };

  const certColors: Record<CertificationLevel, string> = {
    "EMT-Basic": "bg-blue-100 text-blue-700",
    "EMT-Intermediate": "bg-purple-100 text-purple-700",
    AEMT: "bg-amber-100 text-amber-700",
    Paramedic: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Emergency Medical Technicians
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage EMT staff records and certifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="emt-records.export_button"
            variant="outline"
            onClick={() => {
              const rows = emts.map((e) => ({
                "EMT No": e.emtNo,
                Name: e.name,
                "Certification Level": e.certificationLevel,
                Phone: e.phone,
                Status: e.status,
              }));
              exportToExcel(rows, "emt-records");
            }}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </Button>
          <Button
            data-ocid="emt.open_modal_button"
            onClick={openCreate}
            className="gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add EMT
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="emt.search_input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or EMT number..."
          className="pl-9"
        />
      </div>

      <Card className="shadow-card">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div
              data-ocid="emt.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <Ambulance className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {search
                  ? "No EMT records match your search"
                  : "No EMT records yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      EMT No.
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Certification
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Phone
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, idx) => (
                    <tr
                      key={e.id}
                      data-ocid={`emt.row.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {e.emtNo}
                      </td>
                      <td className="px-4 py-3 font-medium">{e.name}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            certColors[e.certificationLevel]
                          }`}
                        >
                          {e.certificationLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {e.phone || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            e.status === "Active" ? "default" : "secondary"
                          }
                          className={
                            e.status === "Active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : ""
                          }
                        >
                          {e.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            data-ocid={`emt.edit_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(e)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`emt.delete_button.${idx + 1}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(e.id)}
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
        <DialogContent className="sm:max-w-md" data-ocid="emt.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editEmt ? "Edit EMT" : "Add New EMT"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="emt-name">Full Name *</Label>
              <Input
                id="emt-name"
                data-ocid="emt.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="emt-cert">Certification Level</Label>
              <Select
                value={form.certificationLevel}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    certificationLevel: v as CertificationLevel,
                  }))
                }
              >
                <SelectTrigger
                  id="emt-cert"
                  data-ocid="emt.certification.select"
                  className="mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMT-Basic">EMT-Basic</SelectItem>
                  <SelectItem value="EMT-Intermediate">
                    EMT-Intermediate
                  </SelectItem>
                  <SelectItem value="AEMT">AEMT</SelectItem>
                  <SelectItem value="Paramedic">Paramedic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emt-phone">Phone</Label>
              <Input
                id="emt-phone"
                data-ocid="emt.phone.input"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="Phone number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="emt-status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as StatusType }))
                }
              >
                <SelectTrigger
                  id="emt-status"
                  data-ocid="emt.status.select"
                  className="mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="emt.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button data-ocid="emt.submit_button" onClick={handleSubmit}>
              {editEmt ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="emt.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete EMT Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This EMT record will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="emt.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="emt.confirm_button"
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
