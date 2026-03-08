import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AppLayout from "./components/AppLayout";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserRole } from "./hooks/useQueries";
import CreateInvoicePage from "./pages/CreateInvoicePage";
import DashboardPage from "./pages/DashboardPage";
import DokterPage from "./pages/DokterPage";
import InvoicePage from "./pages/InvoicePage";
import KatalogLayananPage from "./pages/KatalogLayananPage";
import LoginPage from "./pages/LoginPage";
import PasienPage from "./pages/PasienPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import PengaturanPage from "./pages/PengaturanPage";
import PrintInvoicePage from "./pages/PrintInvoicePage";
import PrintSuratSakitPage from "./pages/PrintSuratSakitPage";
import PrintSuratSehatPage from "./pages/PrintSuratSehatPage";
import SuratSakitPage from "./pages/SuratSakitPage";
import SuratSehatPage from "./pages/SuratSehatPage";

export type Page =
  | "dashboard"
  | "pasien"
  | "dokter"
  | "invoice"
  | "invoice-create"
  | "surat-sakit"
  | "surat-sehat"
  | "katalog"
  | "pengaturan"
  | "print-invoice"
  | "print-surat-sakit"
  | "print-surat-sehat";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [printId, setPrintId] = useState<bigint | null>(null);

  const roleQuery = useGetCallerUserRole();

  const navigate = (page: Page, id?: bigint) => {
    if (id !== undefined) setPrintId(id);
    setCurrentPage(page);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">
            Memuat sistem...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <LoginPage />
        <Toaster />
      </>
    );
  }

  if (actorFetching || roleQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm font-sans">
            Memverifikasi akses...
          </p>
        </div>
      </div>
    );
  }

  const role = roleQuery.data;

  if (role === "guest") {
    return (
      <>
        <PendingApprovalPage />
        <Toaster />
      </>
    );
  }

  // Print pages - full screen without sidebar
  if (currentPage === "print-invoice" && printId !== null) {
    return (
      <>
        <PrintInvoicePage
          invoiceId={printId}
          onBack={() => navigate("invoice")}
        />
        <Toaster />
      </>
    );
  }
  if (currentPage === "print-surat-sakit" && printId !== null) {
    return (
      <>
        <PrintSuratSakitPage
          noteId={printId}
          onBack={() => navigate("surat-sakit")}
        />
        <Toaster />
      </>
    );
  }
  if (currentPage === "print-surat-sehat" && printId !== null) {
    return (
      <>
        <PrintSuratSehatPage
          certId={printId}
          onBack={() => navigate("surat-sehat")}
        />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage navigate={navigate} />;
      case "pasien":
        return <PasienPage />;
      case "dokter":
        return <DokterPage />;
      case "invoice":
        return (
          <InvoicePage
            navigate={navigate}
            onCreateNew={() => navigate("invoice-create")}
            onPrint={(id) => navigate("print-invoice", id)}
          />
        );
      case "invoice-create":
        return (
          <CreateInvoicePage
            onSuccess={() => navigate("invoice")}
            onCancel={() => navigate("invoice")}
          />
        );
      case "surat-sakit":
        return (
          <SuratSakitPage onPrint={(id) => navigate("print-surat-sakit", id)} />
        );
      case "surat-sehat":
        return (
          <SuratSehatPage onPrint={(id) => navigate("print-surat-sehat", id)} />
        );
      case "katalog":
        return <KatalogLayananPage />;
      case "pengaturan":
        return <PengaturanPage />;
      default:
        return <DashboardPage navigate={navigate} />;
    }
  };

  return (
    <>
      <AppLayout
        currentPage={currentPage}
        navigate={navigate}
        userRole={role ?? "user"}
      >
        {renderPage()}
      </AppLayout>
      <Toaster />
    </>
  );
}
