import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToExcel } from "@/lib/exportExcel";
import {
  ChevronLeft,
  ChevronRight,
  FileHeart,
  FileSpreadsheet,
  FileText,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  Invoice,
  Patient,
  SuratKeteranganSakit,
  SuratKeteranganSehat,
} from "../backend.d";
import {
  useGetHealthCertificates,
  useGetInvoices,
  useGetPatients,
  useGetSickNotes,
} from "../hooks/useQueries";
import { formatDate, formatRupiah } from "../utils/formatters";

type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

function nanosToMs(nanos: bigint): number {
  return Number(nanos / BigInt(1_000_000));
}

function getInvoiceTotal(inv: Invoice): number {
  return inv.lineItems.reduce((sum, li) => sum + Number(li.appliedCharge), 0);
}

// Get Monday of the week containing `date`
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSundayOfWeek(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatPeriodLabel(type: PeriodType, offset: number): string {
  const now = new Date();
  if (type === "daily") {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (type === "weekly") {
    const monday = getMondayOfWeek(now);
    monday.setDate(monday.getDate() + offset * 7);
    const sunday = getSundayOfWeek(monday);
    const sameMonth =
      monday.getMonth() === sunday.getMonth() &&
      monday.getFullYear() === sunday.getFullYear();
    if (sameMonth) {
      return `${monday.getDate()} – ${sunday.getDate()} ${monday.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
    }
    return `${monday.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${sunday.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  }
  if (type === "monthly") {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }
  // yearly
  return String(now.getFullYear() + offset);
}

function getPeriodBounds(type: PeriodType, offset: number): [Date, Date] {
  const now = new Date();
  if (type === "daily") {
    const d = new Date(now);
    d.setDate(d.getDate() + offset);
    const start = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      0,
      0,
      0,
      0,
    );
    const end = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      23,
      59,
      59,
      999,
    );
    return [start, end];
  }
  if (type === "weekly") {
    const monday = getMondayOfWeek(now);
    monday.setDate(monday.getDate() + offset * 7);
    const sunday = getSundayOfWeek(monday);
    return [monday, sunday];
  }
  if (type === "monthly") {
    const start = new Date(
      now.getFullYear(),
      now.getMonth() + offset,
      1,
      0,
      0,
      0,
      0,
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth() + offset + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return [start, end];
  }
  // yearly
  const year = now.getFullYear() + offset;
  return [
    new Date(year, 0, 1, 0, 0, 0, 0),
    new Date(year, 11, 31, 23, 59, 59, 999),
  ];
}

function inPeriod(tsNanos: bigint, start: Date, end: Date): boolean {
  const ms = nanosToMs(tsNanos);
  return ms >= start.getTime() && ms <= end.getTime();
}

interface PeriodStats {
  patientCount: number;
  invoiceCount: number;
  totalRevenue: number;
  documentCount: number;
  invoices: Invoice[];
  patients: Patient[];
}

function computeStats(
  type: PeriodType,
  offset: number,
  patients: Patient[],
  invoices: Invoice[],
  sickNotes: SuratKeteranganSakit[],
  healthCerts: SuratKeteranganSehat[],
): PeriodStats {
  const [start, end] = getPeriodBounds(type, offset);

  const filteredPatients = patients.filter((p) =>
    inPeriod(p.createdAt, start, end),
  );
  const filteredInvoices = invoices.filter((inv) =>
    inPeriod(inv.dateOfPrinting, start, end),
  );
  const filteredSickNotes = sickNotes.filter((sn) =>
    inPeriod(sn.issuedDate, start, end),
  );
  const filteredHealthCerts = healthCerts.filter((hc) =>
    inPeriod(hc.issuedDate, start, end),
  );

  const totalRevenue = filteredInvoices.reduce(
    (sum, inv) => sum + getInvoiceTotal(inv),
    0,
  );

  return {
    patientCount: filteredPatients.length,
    invoiceCount: filteredInvoices.length,
    totalRevenue,
    documentCount: filteredSickNotes.length + filteredHealthCerts.length,
    invoices: filteredInvoices,
    patients: filteredPatients,
  };
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold font-display text-foreground leading-tight">
              {value}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PeriodViewProps {
  type: PeriodType;
  patients: Patient[];
  invoices: Invoice[];
  sickNotes: SuratKeteranganSakit[];
  healthCerts: SuratKeteranganSehat[];
  isLoading: boolean;
}

function PeriodView({
  type,
  patients,
  invoices,
  sickNotes,
  healthCerts,
  isLoading,
}: PeriodViewProps) {
  const [offset, setOffset] = useState(0);

  const stats = useMemo(
    () =>
      computeStats(type, offset, patients, invoices, sickNotes, healthCerts),
    [type, offset, patients, invoices, sickNotes, healthCerts],
  );

  const label = formatPeriodLabel(type, offset);
  const patientMap = useMemo(() => {
    const map = new Map<bigint, string>();
    for (const p of patients) map.set(p.id, p.name);
    return map;
  }, [patients]);

  const scopeId = `recap.${type}`;

  return (
    <div className="space-y-6">
      {/* Period Navigator */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          data-ocid={`${scopeId}.pagination_prev`}
          onClick={() => setOffset((o) => o - 1)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="font-semibold text-sm text-foreground">{label}</p>
          {offset !== 0 && (
            <button
              type="button"
              data-ocid={`${scopeId}.toggle`}
              className="text-xs text-primary hover:underline mt-0.5"
              onClick={() => setOffset(0)}
            >
              Back to current
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          data-ocid={`${scopeId}.pagination_next`}
          onClick={() => setOffset((o) => o + 1)}
          className="h-8 w-8 p-0"
          disabled={offset >= 0}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          data-ocid="recap.export_button"
          variant="outline"
          size="sm"
          onClick={() => {
            const rows = [
              {
                Period: label,
                Patients: stats.patientCount,
                Invoices: stats.invoiceCount,
                "Revenue (IDR)": stats.totalRevenue,
                Documents: stats.documentCount,
              },
            ];
            exportToExcel(rows, "recap");
          }}
          className="gap-2"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Export Excel
        </Button>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Patients"
            value={String(stats.patientCount)}
            icon={Users}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Invoices"
            value={String(stats.invoiceCount)}
            icon={Receipt}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Revenue"
            value={formatRupiah(stats.totalRevenue)}
            icon={TrendingUp}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="Documents"
            value={String(stats.documentCount)}
            icon={FileHeart}
            color="bg-orange-100 text-orange-600"
          />
        </div>
      )}

      {/* Invoice Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Invoices This Period
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : stats.invoices.length === 0 ? (
            <div
              data-ocid={`${scopeId}.empty_state`}
              className="flex flex-col items-center py-10 text-muted-foreground"
            >
              <FileText className="w-8 h-8 mb-2 opacity-25" />
              <p className="text-sm">No invoices in this period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid={`${scopeId}.table`}>
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Patient
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Reg No.
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.invoices.map((inv, idx) => (
                    <tr
                      key={String(inv.id)}
                      data-ocid={`${scopeId}.row.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {patientMap.get(inv.patientId) ?? "–"}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="font-mono text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                          {inv.regNo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {formatDate(inv.dateOfPrinting)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {formatRupiah(getInvoiceTotal(inv))}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex justify-center">
                          <Badge
                            variant={
                              inv.status === "final" ? "default" : "secondary"
                            }
                            className={`text-xs ${
                              inv.status === "final"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {inv.status === "final" ? "Final" : "Draft"}
                          </Badge>
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
    </div>
  );
}

export default function RekapPage() {
  const { data: patients = [], isLoading: loadingPatients } = useGetPatients();
  const { data: invoices = [], isLoading: loadingInvoices } = useGetInvoices();
  const { data: sickNotes = [], isLoading: loadingSickNotes } =
    useGetSickNotes();
  const { data: healthCerts = [], isLoading: loadingHealthCerts } =
    useGetHealthCertificates();

  const isLoading =
    loadingPatients ||
    loadingInvoices ||
    loadingSickNotes ||
    loadingHealthCerts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Data Recap
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Summary of clinic activity by period
        </p>
      </div>

      <Tabs defaultValue="daily" data-ocid="recap.tab">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="daily" data-ocid="recap.daily.tab">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" data-ocid="recap.weekly.tab">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" data-ocid="recap.monthly.tab">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" data-ocid="recap.yearly.tab">
            Yearly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <PeriodView
            type="daily"
            patients={patients}
            invoices={invoices}
            sickNotes={sickNotes}
            healthCerts={healthCerts}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <PeriodView
            type="weekly"
            patients={patients}
            invoices={invoices}
            sickNotes={sickNotes}
            healthCerts={healthCerts}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <PeriodView
            type="monthly"
            patients={patients}
            invoices={invoices}
            sickNotes={sickNotes}
            healthCerts={healthCerts}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="yearly" className="mt-6">
          <PeriodView
            type="yearly"
            patients={patients}
            invoices={invoices}
            sickNotes={sickNotes}
            healthCerts={healthCerts}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
