import { Toaster } from "@/components/ui/sonner";
import { Suspense, lazy, useState } from "react";
import AppLayout from "./components/AppLayout";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserRole } from "./hooks/useQueries";

const CreateInvoicePage = lazy(() => import("./pages/CreateInvoicePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const DokterPage = lazy(() => import("./pages/DokterPage"));
const InvoicePage = lazy(() => import("./pages/InvoicePage"));
const KatalogLayananPage = lazy(() => import("./pages/KatalogLayananPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PasienPage = lazy(() => import("./pages/PasienPage"));
const PendingApprovalPage = lazy(() => import("./pages/PendingApprovalPage"));
const PengaturanPage = lazy(() => import("./pages/PengaturanPage"));
const PrintInvoicePage = lazy(() => import("./pages/PrintInvoicePage"));
const PrintSuratSakitPage = lazy(() => import("./pages/PrintSuratSakitPage"));
const PrintSuratSehatPage = lazy(() => import("./pages/PrintSuratSehatPage"));
const SuratSakitPage = lazy(() => import("./pages/SuratSakitPage"));
const SuratSehatPage = lazy(() => import("./pages/SuratSehatPage"));

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

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-sans">Loading...</p>
      </div>
    </div>
  );
}

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
            Loading system...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <Suspense fallback={<PageLoader />}>
          <LoginPage />
        </Suspense>
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
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  const role = roleQuery.data;

  if (role === "guest") {
    return (
      <>
        <Suspense fallback={<PageLoader />}>
          <PendingApprovalPage />
        </Suspense>
        <Toaster />
      </>
    );
  }

  // Print pages - full screen without sidebar
  if (currentPage === "print-invoice" && printId !== null) {
    return (
      <>
        <Suspense fallback={<PageLoader />}>
          <PrintInvoicePage
            invoiceId={printId}
            onBack={() => navigate("invoice")}
          />
        </Suspense>
        <Toaster />
      </>
    );
  }
  if (currentPage === "print-surat-sakit" && printId !== null) {
    return (
      <>
        <Suspense fallback={<PageLoader />}>
          <PrintSuratSakitPage
            noteId={printId}
            onBack={() => navigate("surat-sakit")}
          />
        </Suspense>
        <Toaster />
      </>
    );
  }
  if (currentPage === "print-surat-sehat" && printId !== null) {
    return (
      <>
        <Suspense fallback={<PageLoader />}>
          <PrintSuratSehatPage
            certId={printId}
            onBack={() => navigate("surat-sehat")}
          />
        </Suspense>
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
        <Suspense fallback={<PageLoader />}>{renderPage()}</Suspense>
      </AppLayout>
      <Toaster />
    </>
  );
}
