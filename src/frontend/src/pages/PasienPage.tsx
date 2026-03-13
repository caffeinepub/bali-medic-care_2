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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel } from "@/lib/exportExcel";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronsUpDown,
  FileSpreadsheet,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Gender } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useCreatePatient,
  useDeletePatient,
  useGetPatients,
  useUpdatePatient,
} from "../hooks/useQueries";
import type { Patient } from "../hooks/useQueries";
import {
  dateToBigIntNanos,
  formatDate,
  nanosToDateInput,
} from "../utils/formatters";

const COUNTRIES = [
  "Indonesia",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
  "Other",
];

function getPatientCountries(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("patientCountry") || "{}");
  } catch {
    return {};
  }
}

function setPatientCountry(id: bigint, country: string) {
  const map = getPatientCountries();
  map[String(id)] = country;
  localStorage.setItem("patientCountry", JSON.stringify(map));
}

interface PatientForm {
  name: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  phone: string;
  country: string;
}

const emptyForm: PatientForm = {
  name: "",
  dateOfBirth: "",
  gender: "male",
  address: "",
  phone: "",
  country: "",
};

function CountryCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleSelect = (country: string) => {
    onChange(country);
    setInputValue(country);
    setOpen(false);
  };

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);
    setOpen(true);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative mt-1">
          <Input
            data-ocid="pasien.country.input"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Type or search country..."
            className="pr-8"
          />
          <ChevronsUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 w-[--radix-popover-trigger-width]"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            {filtered.length === 0 ? (
              <CommandEmpty>
                <span className="text-xs text-muted-foreground">
                  No match -- "{inputValue}" will be saved as entered
                </span>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filtered.slice(0, 50).map((c) => (
                  <CommandItem
                    key={c}
                    value={c}
                    onSelect={() => handleSelect(c)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === c ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {c}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function PasienPage() {
  const { data: patients, isLoading } = useGetPatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();
  const queryClient = useQueryClient();
  const { actor } = useActor();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [form, setForm] = useState<PatientForm>(emptyForm);

  const countryMap = getPatientCountries();

  const filtered = (patients ?? []).filter((p) => {
    const country = countryMap[String(p.id)] || "";
    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientNo.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      country.toLowerCase().includes(search.toLowerCase())
    );
  });

  const openCreate = () => {
    setEditPatient(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setForm({
      name: p.name,
      dateOfBirth: nanosToDateInput(p.dateOfBirth),
      gender: p.gender as "male" | "female" | "other",
      address: p.address,
      phone: p.phone,
      country: getPatientCountries()[String(p.id)] || "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.dateOfBirth) {
      toast.error("Name and date of birth are required");
      return;
    }
    const genderEnum =
      form.gender === "male"
        ? Gender.male
        : form.gender === "female"
          ? Gender.female
          : Gender.other;
    try {
      if (editPatient) {
        await updateMutation.mutateAsync({
          id: editPatient.id,
          name: form.name,
          dateOfBirth: dateToBigIntNanos(form.dateOfBirth),
          gender: genderEnum,
          address: form.address,
          phone: form.phone,
        });
        if (form.country) {
          setPatientCountry(editPatient.id, form.country);
        }
        toast.success("Patient updated");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          dateOfBirth: dateToBigIntNanos(form.dateOfBirth),
          gender: genderEnum,
          address: form.address,
          phone: form.phone,
        });
        if (form.country && actor) {
          try {
            const updated = await queryClient.fetchQuery({
              queryKey: ["patients"],
              queryFn: async () => actor.getPatients(),
            });
            const newP = [...(updated as Patient[])]
              .sort((a, b) => Number(b.createdAt - a.createdAt))
              .find((p) => p.name === form.name);
            if (newP) setPatientCountry(newP.id, form.country);
          } catch {
            // best effort
          }
        }
        toast.success("New patient added");
      }
      setFormOpen(false);
    } catch {
      toast.error("Failed to save patient");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Patient deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Patients
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage clinic patient records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            data-ocid="patients.export_button"
            variant="outline"
            onClick={() => {
              const rows = (patients ?? []).map((pt) => ({
                "Patient No": pt.patientNo,
                Name: pt.name,
                "Date of Birth": formatDate(pt.dateOfBirth),
                Gender: String(pt.gender),
                Address: pt.address,
                Phone: pt.phone,
                Country: countryMap[String(pt.id)] || "",
              }));
              exportToExcel(rows, "patients");
            }}
            className="gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </Button>
          <Button
            data-ocid="pasien.open_modal_button"
            onClick={openCreate}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="pasien.search_input"
          placeholder="Search by name, patient number, phone, or country..."
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

      {/* Table */}
      <Card className="shadow-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="pasien.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <p className="text-sm">
                {search ? "No patients found" : "No patient records yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Patient No.
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Date of Birth
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Gender
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Phone
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Country
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, idx) => {
                    const country = countryMap[String(p.id)] || "";
                    return (
                      <tr
                        key={String(p.id)}
                        data-ocid={`pasien.row.${idx + 1}`}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                            {p.patientNo}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {formatDate(p.dateOfBirth)}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge
                            variant={
                              p.gender === "male" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {p.gender === "male"
                              ? "Male"
                              : p.gender === "female"
                                ? "Female"
                                : "Other"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {p.phone}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {country || (
                            <span className="text-muted-foreground/50">--</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              data-ocid={`pasien.edit_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(p)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              data-ocid={`pasien.delete_button.${idx + 1}`}
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(p.id)}
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

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="pasien.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editPatient ? "Edit Patient" : "Add New Patient"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                data-ocid="pasien.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Patient's full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                data-ocid="pasien.dob.input"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateOfBirth: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    gender: v as "male" | "female" | "other",
                  }))
                }
              >
                <SelectTrigger
                  data-ocid="pasien.gender.select"
                  className="mt-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                data-ocid="pasien.address.input"
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                placeholder="Full address"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                data-ocid="pasien.phone.input"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="Phone number"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Country</Label>
              <CountryCombobox
                value={form.country}
                onChange={(v) => setForm((f) => ({ ...f, country: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="pasien.cancel_button"
              variant="outline"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="pasien.submit_button"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : editPatient
                  ? "Save Changes"
                  : "Add Patient"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent data-ocid="pasien.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The patient record will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="pasien.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="pasien.confirm_button"
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
