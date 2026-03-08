import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { LineItem } from "../backend.d";
import {
  useCreateInvoice,
  useGetPatients,
  useGetServices,
} from "../hooks/useQueries";
import {
  dateToBigIntNanos,
  formatRupiah,
  todayInputValue,
} from "../utils/formatters";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "TINDAKAN",
  "OBAT",
  "LABORATORIUM",
  "KONSULTASI",
  "LAINNYA",
];

interface LineItemRow {
  _key: string;
  date: string;
  category: string;
  description: string;
  basePrice: string;
  qty: string;
  discount: string;
}

let _rowCounter = 0;
const emptyRow = (): LineItemRow => ({
  _key: `row-${++_rowCounter}`,
  date: todayInputValue(),
  category: "TINDAKAN",
  description: "",
  basePrice: "",
  qty: "1",
  discount: "0",
});

function calcApplied(row: LineItemRow): number {
  const bp = Number.parseFloat(row.basePrice) || 0;
  const qty = Number.parseFloat(row.qty) || 0;
  const disc = Number.parseFloat(row.discount) || 0;
  return Math.max(0, bp * qty - disc);
}

export default function CreateInvoicePage({ onSuccess, onCancel }: Props) {
  const { data: patients } = useGetPatients();
  const { data: services } = useGetServices();
  const createMutation = useCreateInvoice();

  const today = todayInputValue();

  const [patientId, setPatientId] = useState<string>("");
  const [registrationDate, setRegistrationDate] = useState(today);
  const [regNo, setRegNo] = useState("");
  const [payer, setPayer] = useState("");
  const [dateOfPrinting, setDateOfPrinting] = useState(today);
  const [status, setStatus] = useState<"draft" | "final">("draft");
  const [lineItems, setLineItems] = useState<LineItemRow[]>([emptyRow()]);
  const [adminFee, setAdminFee] = useState("0");
  const [deposit, setDeposit] = useState("0");

  const subtotal = lineItems.reduce((sum, row) => sum + calcApplied(row), 0);
  const adminFeeNum = Number.parseFloat(adminFee) || 0;
  const depositNum = Number.parseFloat(deposit) || 0;
  const totalBill = subtotal + adminFeeNum - depositNum;

  const addRow = () => setLineItems((rows) => [...rows, emptyRow()]);

  const removeRow = (idx: number) =>
    setLineItems((rows) => rows.filter((_, i) => i !== idx));

  const updateRow = (idx: number, field: keyof LineItemRow, value: string) =>
    setLineItems((rows) =>
      rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
    );

  const selectService = (idx: number, serviceId: string) => {
    const svc = services?.find((s) => String(s.id) === serviceId);
    if (svc) {
      setLineItems((rows) =>
        rows.map((row, i) =>
          i === idx
            ? {
                ...row,
                description: svc.name,
                category: svc.category,
                basePrice: String(svc.basePrice),
              }
            : row,
        ),
      );
    }
  };

  const handleSubmit = async () => {
    if (!patientId) {
      toast.error("Pilih pasien terlebih dahulu");
      return;
    }
    if (!regNo) {
      toast.error("Nomor registrasi wajib diisi");
      return;
    }
    if (lineItems.length === 0) {
      toast.error("Tambahkan minimal satu item");
      return;
    }

    try {
      const items: LineItem[] = lineItems.map((row) => ({
        date: dateToBigIntNanos(row.date || today),
        category: row.category,
        description: row.description,
        basePrice: BigInt(Math.round(Number.parseFloat(row.basePrice) || 0)),
        qty: BigInt(Math.round(Number.parseFloat(row.qty) || 1)),
        discount: BigInt(Math.round(Number.parseFloat(row.discount) || 0)),
        appliedCharge: BigInt(Math.round(calcApplied(row))),
      }));

      await createMutation.mutateAsync({
        patientId: BigInt(patientId),
        registrationDate: dateToBigIntNanos(registrationDate),
        regNo,
        payer: payer || null,
        dateOfPrinting: dateToBigIntNanos(dateOfPrinting),
        status,
        lineItems: items,
      });
      toast.success("Invoice berhasil dibuat");
      onSuccess();
    } catch {
      toast.error("Gagal membuat invoice");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="invoice.back.button"
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Buat Invoice
          </h1>
          <p className="text-sm text-muted-foreground">Proforma Invoice Baru</p>
        </div>
      </div>

      {/* Patient & Registration Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-display">
            Informasi Pasien & Registrasi
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label>Pasien *</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger
                data-ocid="invoice.patient.select"
                className="mt-1"
              >
                <SelectValue placeholder="Pilih pasien" />
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
            <Label htmlFor="regDate">Tanggal Registrasi</Label>
            <Input
              id="regDate"
              type="date"
              data-ocid="invoice.reg_date.input"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="regNo">Nomor Registrasi *</Label>
            <Input
              id="regNo"
              data-ocid="invoice.reg_no.input"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Contoh: OPDN25"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="payer">Payer / Penanggung</Label>
            <Input
              id="payer"
              data-ocid="invoice.payer.input"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              placeholder="Opsional"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="printDate">Tanggal Cetak</Label>
            <Input
              id="printDate"
              type="date"
              data-ocid="invoice.print_date.input"
              value={dateOfPrinting}
              onChange={(e) => setDateOfPrinting(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as "draft" | "final")}
            >
              <SelectTrigger data-ocid="invoice.status.select" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="shadow-card">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base font-display">Item Layanan</CardTitle>
          <Button
            data-ocid="invoice.add_item.button"
            variant="outline"
            size="sm"
            onClick={addRow}
            className="gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Item
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Tanggal
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Dari Katalog
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Kategori
                  </th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Keterangan
                  </th>
                  <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Harga
                  </th>
                  <th className="text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Qty
                  </th>
                  <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Diskon
                  </th>
                  <th className="text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground">
                    Tagihan
                  </th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {lineItems.map((row, idx) => (
                  <tr
                    key={row._key}
                    data-ocid={`invoice.item.${idx + 1}`}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-3 py-2">
                      <Input
                        type="date"
                        value={row.date}
                        onChange={(e) => updateRow(idx, "date", e.target.value)}
                        className="w-32 h-8 text-xs"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Select onValueChange={(v) => selectService(idx, v)}>
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue placeholder="Pilih..." />
                        </SelectTrigger>
                        <SelectContent>
                          {(services ?? []).map((s) => (
                            <SelectItem key={String(s.id)} value={String(s.id)}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Select
                        value={row.category}
                        onValueChange={(v) => updateRow(idx, "category", v)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
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
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={row.description}
                        onChange={(e) =>
                          updateRow(idx, "description", e.target.value)
                        }
                        placeholder="Keterangan"
                        className="w-44 h-8 text-xs"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={row.basePrice}
                        onChange={(e) =>
                          updateRow(idx, "basePrice", e.target.value)
                        }
                        placeholder="0"
                        className="w-28 h-8 text-xs text-right"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={row.qty}
                        onChange={(e) => updateRow(idx, "qty", e.target.value)}
                        className="w-14 h-8 text-xs text-center"
                        min="1"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        type="number"
                        value={row.discount}
                        onChange={(e) =>
                          updateRow(idx, "discount", e.target.value)
                        }
                        placeholder="0"
                        className="w-24 h-8 text-xs text-right"
                      />
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-sm whitespace-nowrap">
                      {formatRupiah(calcApplied(row))}
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        data-ocid={`invoice.remove_item.button.${idx + 1}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRow(idx)}
                        disabled={lineItems.length === 1}
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card className="shadow-card">
        <CardContent className="pt-4">
          <div className="max-w-xs ml-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm gap-4">
              <span className="text-muted-foreground whitespace-nowrap">
                Admin Fee
              </span>
              <Input
                type="number"
                data-ocid="invoice.admin_fee.input"
                value={adminFee}
                onChange={(e) => setAdminFee(e.target.value)}
                className="w-32 h-8 text-xs text-right"
              />
            </div>
            <div className="flex items-center justify-between text-sm gap-4">
              <span className="text-muted-foreground">Deposit</span>
              <Input
                type="number"
                data-ocid="invoice.deposit.input"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-32 h-8 text-xs text-right"
              />
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold">
              <span>Total Tagihan</span>
              <span className="text-primary text-lg font-display">
                {formatRupiah(Math.max(0, totalBill))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          data-ocid="invoice.cancel_button"
          variant="outline"
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          data-ocid="invoice.submit_button"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Menyimpan..." : "Simpan Invoice"}
        </Button>
      </div>
    </div>
  );
}
