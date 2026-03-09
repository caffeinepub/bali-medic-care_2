import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  ImageIcon,
  Stamp,
  Trash2,
  Upload,
  UserPen,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useClinicSettings } from "../hooks/useClinicSettings";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
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
  previewBg?: string;
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
  previewBg = "bg-white",
}: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("File must be an image (PNG, JPG, etc.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      try {
        const dataUrl = await fileToBase64(file);
        onUpload(dataUrl);
        toast.success(`${label} saved successfully`);
      } catch {
        toast.error(`Failed to save ${label.toLowerCase()}`);
      }
    },
    [label, onUpload],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
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
              <div
                className={`border border-border rounded-lg p-3 shadow-sm inline-block ${previewBg}`}
              >
                <img
                  src={value}
                  alt={label}
                  className="max-h-24 max-w-[200px] object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved — click to replace
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-8 h-8 opacity-40 group-hover:opacity-60 transition-opacity" />
              <div>
                <p className="text-sm font-medium">Click or drag file here</p>
                <p className="text-xs mt-0.5 opacity-70">
                  PNG, JPG, WebP · Max. 5MB
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
                toast.success(`${label} removed`);
              }}
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove {label}
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
    logo,
    setSignature,
    setStamp,
    setLogo,
    clearSignature,
    clearStamp,
    clearLogo,
  } = useClinicSettings();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Clinic Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the clinic logo, digital signature, and official stamp that
          will appear on all printed documents.
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary/80 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <p>
          All images are stored locally on this device and will automatically
          appear on Invoice, Sick Note, and Health Certificate when printed.
        </p>
      </div>

      {/* Logo section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Clinic Identity
        </h2>
        <UploadArea
          label="Clinic Logo"
          description="Upload the clinic logo to appear in the header of all printed documents (transparent PNG recommended, max width 300px)"
          icon={<ImageIcon className="w-4 h-4" />}
          value={logo}
          onUpload={setLogo}
          onClear={clearLogo}
          uploadOcid="pengaturan.logo.upload_button"
          dropzoneOcid="pengaturan.logo.dropzone"
          deleteOcid="pengaturan.logo.delete_button"
        />
      </div>

      {/* Signature & Stamp section */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Signature & Stamp
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          The signature and stamp will be merged together in the document
          footer. Use transparent PNG for the best result.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <UploadArea
            label="Digital Signature"
            description="Upload doctor's signature image (transparent PNG recommended)"
            icon={<UserPen className="w-4 h-4" />}
            value={signature}
            onUpload={setSignature}
            onClear={clearSignature}
            uploadOcid="pengaturan.signature.upload_button"
            dropzoneOcid="pengaturan.signature.dropzone"
            deleteOcid="pengaturan.signature.delete_button"
          />

          <UploadArea
            label="Clinic Stamp"
            description="Upload clinic's official stamp image (transparent PNG recommended)"
            icon={<Stamp className="w-4 h-4" />}
            value={stamp}
            onUpload={setStamp}
            onClear={clearStamp}
            uploadOcid="pengaturan.stamp.upload_button"
            dropzoneOcid="pengaturan.stamp.dropzone"
            deleteOcid="pengaturan.stamp.delete_button"
          />
        </div>
      </div>

      {/* Preview section */}
      {(signature || stamp || logo) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-semibold">
                Document Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="border border-dashed border-border/60 rounded-lg p-6 bg-white">
                {/* Header preview with logo */}
                {logo && (
                  <div className="flex justify-center mb-4 pb-3 border-b-2 border-gray-300">
                    <img
                      src={logo}
                      alt="Clinic Logo"
                      className="max-h-16 max-w-[200px] object-contain"
                    />
                  </div>
                )}

                {/* Signature + stamp merged area */}
                {(signature || stamp) && (
                  <div className="flex justify-end">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Kuta, Bali,{" "}
                        {new Date().toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Examining Doctor,
                      </p>
                      {/* Merged signature + stamp */}
                      <div className="relative inline-flex items-center justify-center mt-2 h-20 w-48">
                        {signature && (
                          <img
                            src={signature}
                            alt="Signature"
                            className="absolute inset-0 w-full h-full object-contain z-10"
                          />
                        )}
                        {stamp && (
                          <img
                            src={stamp}
                            alt="Clinic stamp"
                            className="absolute inset-0 w-full h-full object-contain opacity-60 z-20"
                          />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mt-1">
                        dr. Romy Kamaluddin
                      </p>
                      <p className="text-xs text-gray-400">
                        General Practitioner
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Preview of the header and signature area on printed documents
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
