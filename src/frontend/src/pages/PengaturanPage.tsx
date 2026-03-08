import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Stamp, Trash2, Upload, UserPen } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useClinicSettings } from "../hooks/useClinicSettings";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

interface UploadAreaProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  value: string | null;
  onUpload: (dataUrl: string) => void;
  onClear: () => void;
  uploadOcid: string;
  dropzoneOcid: string;
  deleteOcid: string;
}

function UploadArea({
  label,
  description,
  icon,
  value,
  onUpload,
  onClear,
  uploadOcid,
  dropzoneOcid,
  deleteOcid,
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar (PNG, JPG, dll.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (maksimal 5MB)");
        return;
      }
      try {
        const dataUrl = await fileToBase64(file);
        onUpload(dataUrl);
        toast.success(`${label} berhasil disimpan`);
      } catch {
        toast.error(`Gagal menyimpan ${label.toLowerCase()}`);
      }
    },
    [label, onUpload],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
        // Reset input so same file can be re-uploaded
        e.target.value = "";
      }
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <span className="text-primary">{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <p className="text-xs text-muted-foreground">{description}</p>

        {/* Dropzone */}
        <button
          type="button"
          data-ocid={dropzoneOcid}
          className="relative w-full border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer transition-colors hover:border-primary/60 hover:bg-primary/5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          aria-label={`Upload ${label}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            onChange={handleInputChange}
            data-ocid={uploadOcid}
          />

          {value ? (
            <div className="flex flex-col items-center gap-3">
              {/* Preview */}
              <div className="bg-white border border-border rounded-lg p-3 shadow-sm inline-block">
                <img
                  src={value}
                  alt={label}
                  className="max-h-24 max-w-[200px] object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tersimpan — klik untuk ganti
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-8 h-8 opacity-40 group-hover:opacity-60 transition-opacity" />
              <div>
                <p className="text-sm font-medium">
                  Klik atau seret file ke sini
                </p>
                <p className="text-xs mt-0.5 opacity-70">
                  PNG, JPG, WebP · Maks. 5MB
                </p>
              </div>
            </div>
          )}
        </button>

        {/* Delete button */}
        {value && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid={deleteOcid}
              onClick={() => {
                onClear();
                toast.success(`${label} dihapus`);
              }}
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus {label}
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PengaturanPage() {
  const {
    signature,
    stamp,
    setSignature,
    setStamp,
    clearSignature,
    clearStamp,
  } = useClinicSettings();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Pengaturan Klinik
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola tanda tangan digital dan cap resmi klinik yang akan muncul di
          semua dokumen cetak.
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary/80 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <p>
          Tanda tangan dan cap disimpan di perangkat ini secara lokal. Gambar
          akan otomatis tampil di Invoice, Surat Keterangan Sakit, dan Surat
          Keterangan Sehat saat dicetak.
        </p>
      </div>

      {/* Upload sections */}
      <div className="grid gap-5 sm:grid-cols-2">
        <UploadArea
          label="Tanda Tangan Digital"
          description="Upload gambar tanda tangan dokter (PNG transparan direkomendasikan)"
          icon={<UserPen className="w-4 h-4" />}
          value={signature}
          onUpload={setSignature}
          onClear={clearSignature}
          uploadOcid="pengaturan.signature.upload_button"
          dropzoneOcid="pengaturan.signature.dropzone"
          deleteOcid="pengaturan.signature.delete_button"
        />

        <UploadArea
          label="Cap / Stempel Klinik"
          description="Upload gambar cap atau stempel resmi klinik (PNG transparan direkomendasikan)"
          icon={<Stamp className="w-4 h-4" />}
          value={stamp}
          onUpload={setStamp}
          onClear={clearStamp}
          uploadOcid="pengaturan.stamp.upload_button"
          dropzoneOcid="pengaturan.stamp.dropzone"
          deleteOcid="pengaturan.stamp.delete_button"
        />
      </div>

      {/* Preview section */}
      {(signature || stamp) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold">
                Preview pada Dokumen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="border border-dashed border-border/60 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-end">
                  {/* Left: signature area */}
                  <div className="text-center text-xs text-gray-500">
                    <p>
                      Kuta, Bali,{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1">Dokter Pemeriksa,</p>
                    <div className="h-16 flex items-center justify-center mt-1">
                      {signature ? (
                        <img
                          src={signature}
                          alt="Tanda tangan"
                          className="max-h-14 max-w-[160px] object-contain"
                        />
                      ) : (
                        <div className="h-14 w-28 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-300 text-[10px]">
                          Tanda tangan
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-800">
                      dr. Romy Kamaluddin
                    </p>
                    <p className="text-gray-400">Dokter Umum</p>
                  </div>

                  {/* Right: stamp */}
                  <div className="flex items-center justify-center">
                    {stamp ? (
                      <img
                        src={stamp}
                        alt="Cap klinik"
                        className="max-h-20 max-w-[100px] object-contain opacity-80"
                      />
                    ) : (
                      <div className="h-20 w-20 border border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-300 text-[10px] text-center">
                        Cap klinik
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Tampilan preview area tanda tangan pada dokumen cetak
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
