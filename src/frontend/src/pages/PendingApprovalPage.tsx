import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function PendingApprovalPage() {
  const { clear, identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() ?? "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.22_0.055_215)] to-[oklch(0.28_0.06_210)] flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-2">
          Menunggu Persetujuan
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Akun Anda sedang dalam proses verifikasi oleh administrator. Silahkan
          hubungi admin untuk mendapatkan akses.
        </p>
        <div className="bg-muted rounded-lg p-3 mb-6 text-left">
          <p className="text-xs text-muted-foreground mb-1">
            Principal ID Anda:
          </p>
          <p className="text-xs font-mono text-foreground break-all">
            {principal}
          </p>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Hubungi:{" "}
          <span className="font-medium text-foreground">+62 818-588-911</span>
        </p>
        <Button
          data-ocid="pending.logout.button"
          variant="outline"
          onClick={clear}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </Button>
      </div>
    </div>
  );
}
