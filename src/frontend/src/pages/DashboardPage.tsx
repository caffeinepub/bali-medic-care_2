import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cross,
  FileText,
  Heart,
  PlusCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Page } from "../App";
import {
  useGetHealthCertificates,
  useGetInvoices,
  useGetPatients,
  useGetSickNotes,
} from "../hooks/useQueries";
import { formatDate, formatRupiah } from "../utils/formatters";

interface Props {
  navigate: (page: Page) => void;
}

export default function DashboardPage({ navigate }: Props) {
  const patients = useGetPatients();
  const invoices = useGetInvoices();
  const sickNotes = useGetSickNotes();
  const healthCerts = useGetHealthCertificates();

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const todayEnd = todayStart + 86400000;

  const invoicesToday = (invoices.data ?? []).filter((inv) => {
    const ms = Number(inv.dateOfPrinting / BigInt(1_000_000));
    return ms >= todayStart && ms < todayEnd;
  });

  const totalDocuments =
    (sickNotes.data?.length ?? 0) + (healthCerts.data?.length ?? 0);

  const recentInvoices = [...(invoices.data ?? [])]
    .sort((a, b) => Number(b.dateOfPrinting - a.dateOfPrinting))
    .slice(0, 5);

  const recentPatients = [...(patients.data ?? [])]
    .sort((a, b) => Number(b.createdAt - a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      id: "total-pasien",
      label: "Total Pasien",
      value: patients.data?.length ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      isLoading: patients.isLoading,
    },
    {
      id: "invoice-today",
      label: "Invoice Hari Ini",
      value: invoicesToday.length,
      icon: FileText,
      color: "bg-teal-50 text-teal-600",
      isLoading: invoices.isLoading,
    },
    {
      id: "total-invoice",
      label: "Total Invoice",
      value: invoices.data?.length ?? 0,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      isLoading: invoices.isLoading,
    },
    {
      id: "total-surat",
      label: "Total Surat Keterangan",
      value: totalDocuments,
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
      isLoading: sickNotes.isLoading || healthCerts.isLoading,
    },
  ];

  return (
    <div className="space-y-6" data-ocid="dashboard.section">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Bali Medic Care — {formatDate(BigInt(Date.now()) * BigInt(1_000_000))}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.id} className="shadow-card">
              <CardContent className="p-4">
                {stat.isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground font-display">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-display">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            data-ocid="dashboard.invoice.primary_button"
            onClick={() => navigate("invoice-create")}
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Buat Invoice
          </Button>
          <Button
            data-ocid="dashboard.surat-sakit.secondary_button"
            variant="outline"
            onClick={() => navigate("surat-sakit")}
            className="gap-2"
          >
            <Cross className="w-4 h-4" />
            Surat Keterangan Sakit
          </Button>
          <Button
            data-ocid="dashboard.surat-sehat.secondary_button"
            variant="outline"
            onClick={() => navigate("surat-sehat")}
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
            Surat Keterangan Sehat
          </Button>
          <Button
            data-ocid="dashboard.pasien.secondary_button"
            variant="outline"
            onClick={() => navigate("pasien")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Tambah Pasien
          </Button>
        </CardContent>
      </Card>

      {/* Recent Data */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">
              Invoice Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentInvoices.length === 0 ? (
              <div
                data-ocid="invoice.empty_state"
                className="text-center py-6 text-muted-foreground text-sm"
              >
                Belum ada invoice
              </div>
            ) : (
              <div className="space-y-2">
                {recentInvoices.map((inv, idx) => {
                  const total = inv.lineItems.reduce(
                    (sum, li) => sum + Number(li.appliedCharge),
                    0,
                  );
                  const patient = patients.data?.find(
                    (p) => p.id === inv.patientId,
                  );
                  return (
                    <div
                      key={String(inv.id)}
                      data-ocid={`invoice.item.${idx + 1}`}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {patient?.name ?? "–"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.regNo} · {formatDate(inv.dateOfPrinting)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {formatRupiah(total)}
                        </p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            inv.status === "final"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {inv.status === "final" ? "Final" : "Draft"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">
              Pasien Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patients.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentPatients.length === 0 ? (
              <div
                data-ocid="pasien.empty_state"
                className="text-center py-6 text-muted-foreground text-sm"
              >
                Belum ada data pasien
              </div>
            ) : (
              <div className="space-y-2">
                {recentPatients.map((p, idx) => (
                  <div
                    key={String(p.id)}
                    data-ocid={`pasien.item.${idx + 1}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.patientNo} ·{" "}
                        {p.gender === "male"
                          ? "Laki-laki"
                          : p.gender === "female"
                            ? "Perempuan"
                            : "Lainnya"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
