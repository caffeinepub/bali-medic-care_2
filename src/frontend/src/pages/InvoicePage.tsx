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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel } from "@/lib/exportExcel";
import {
  FileSpreadsheet,
  FileText,
  Plus,
  Printer,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import {
  useDeleteInvoice,
  useGetInvoices,
  useGetPatients,
} from "../hooks/useQueries";
import { formatDate, formatRupiah } from "../utils/formatters";

interface Props {
  navigate: (page: Page) => void;
  onCreateNew: () => void;
  onPrint: (id: bigint) => void;
}

export default function InvoicePage({ onCreateNew, onPrint }: Props) {
  const { data: invoices, isLoading } = useGetInvoices();
  const { data: patients } = useGetPatients();
  const deleteMutation = useDeleteInvoice();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const filtered = (invoices ?? []).filter((inv) => {
    const patient = patients?.find((p) => p.id === inv.patientId);
    const q = search.toLowerCase();
    return (
      inv.regNo.toLowerCase().includes(q) ||
      (patient?.name.toLowerCase().includes(q) ?? false)
    );
  });

  const getTotal = (inv: (typeof filtered)[0]) =>
    inv.lineItems.reduce((sum, li) => sum + Number(li.appliedCharge), 0);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Invoice deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Invoice
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Clinic Proforma Invoice
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="invoices.export_button"
            variant="outline"
            onClick={() => {
              const rows = (invoices ?? []).map((invItem) => {
                const patient = patients?.find(
                  (p) => p.id === invItem.patientId,
                );
                return {
                  "Reg No": invItem.regNo,
                  Patient: patient?.name ?? String(invItem.patientId),
                  Payer: invItem.payer ?? "",
                  Status: invItem.status,
                  "Total (IDR)": invItem.lineItems.reduce(
                    (s, li) => s + Number(li.appliedCharge),
                    0,
                  ),
                };
              });
              exportToExcel(rows, "invoices");
            }}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </Button>
          <Button
            data-ocid="invoice.open_modal_button"
            onClick={onCreateNew}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="invoice.search_input"
          placeholder="Search by patient name or registration number..."
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

      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="invoice.empty_state"
              className="flex flex-col items-center py-12 text-muted-foreground"
            >
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">
                {search ? "No invoices found" : "No invoices yet"}
              </p>
              {!search && (
                <Button
                  data-ocid="invoice.primary_button"
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                  onClick={onCreateNew}
                >
                  <Plus className="w-4 h-4" />
                  Create First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Reg No.
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv, idx) => {
                    const patient = patients?.find(
                      (p) => p.id === inv.patientId,
                    );
                    const total = getTotal(inv);
                    return (
                      <tr
                        key={String(inv.id)}
                        data-ocid={`invoice.row.${idx + 1}`}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                            {inv.regNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {patient?.name ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {formatDate(inv.dateOfPrinting)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatRupiah(total)}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="flex justify-center">
                            <Badge
                              variant={
                                inv.status === "final" ? "default" : "secondary"
                              }
                              className={`text-xs ${inv.status === "final" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-yellow-100 text-yellow-700"}`}
                            >
                              {inv.status === "final" ? "Final" : "Draft"}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`invoice.print.button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => onPrint(inv.id)}
                              className="h-8 w-8 p-0 text-primary"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`invoice.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(inv.id)}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="invoice.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This invoice will be permanently deleted and cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="invoice.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="invoice.confirm_button"
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
