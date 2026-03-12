import { u as useGetPatients, s as useCreatePatient, t as useUpdatePatient, v as useDeletePatient, w as useQueryClient, x as useActor, r as reactExports, j as jsxRuntimeExports, B as Button, X, c as ue } from "./index-Cj1LDNoz.js";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-CJzCXspO.js";
import { S as Search, B as Badge } from "./badge-CEo7SRfY.js";
import { C as Card, c as CardContent } from "./card-Do55eSVE.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-12BErvOy.js";
import { P as Plus, I as Input } from "./Combination-LFyt6rgd.js";
import { L as Label } from "./label-DuCZGXsM.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-gDKftB0e.js";
import { S as Skeleton } from "./skeleton-yQPGKswp.js";
import { a as formatDate, n as nanosToDateInput, d as dateToBigIntNanos } from "./formatters-DRYxEYqJ.js";
import { P as Pencil } from "./pencil-DsSimgtt.js";
import { T as Trash2 } from "./trash-2-CWr4IgiC.js";
var Gender = /* @__PURE__ */ ((Gender2) => {
  Gender2["other"] = "other";
  Gender2["female"] = "female";
  Gender2["male"] = "male";
  return Gender2;
})(Gender || {});
const COUNTRIES = [
  "Indonesia",
  "Malaysia",
  "Singapore",
  "Thailand",
  "Philippines",
  "Vietnam",
  "Myanmar",
  "Cambodia",
  "Laos",
  "Brunei",
  "Australia",
  "China",
  "Japan",
  "South Korea",
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Netherlands",
  "Russia",
  "Saudi Arabia",
  "UAE",
  "Canada",
  "New Zealand",
  "Taiwan",
  "Hong Kong",
  "Bangladesh",
  "Pakistan",
  "Sri Lanka",
  "Other"
];
function getPatientCountries() {
  try {
    return JSON.parse(localStorage.getItem("patientCountry") || "{}");
  } catch {
    return {};
  }
}
function setPatientCountry(id, country) {
  const map = getPatientCountries();
  map[String(id)] = country;
  localStorage.setItem("patientCountry", JSON.stringify(map));
}
const emptyForm = {
  name: "",
  dateOfBirth: "",
  gender: "male",
  address: "",
  phone: "",
  country: ""
};
function PasienPage() {
  const { data: patients, isLoading } = useGetPatients();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const deleteMutation = useDeletePatient();
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const [search, setSearch] = reactExports.useState("");
  const [formOpen, setFormOpen] = reactExports.useState(false);
  const [editPatient, setEditPatient] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(emptyForm);
  const countryMap = getPatientCountries();
  const filtered = (patients ?? []).filter((p) => {
    const country = countryMap[String(p.id)] || "";
    return p.name.toLowerCase().includes(search.toLowerCase()) || p.patientNo.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search) || country.toLowerCase().includes(search.toLowerCase());
  });
  const openCreate = () => {
    setEditPatient(null);
    setForm(emptyForm);
    setFormOpen(true);
  };
  const openEdit = (p) => {
    setEditPatient(p);
    setForm({
      name: p.name,
      dateOfBirth: nanosToDateInput(p.dateOfBirth),
      gender: p.gender,
      address: p.address,
      phone: p.phone,
      country: getPatientCountries()[String(p.id)] || ""
    });
    setFormOpen(true);
  };
  const handleSubmit = async () => {
    if (!form.name || !form.dateOfBirth) {
      ue.error("Name and date of birth are required");
      return;
    }
    const genderEnum = form.gender === "male" ? Gender.male : form.gender === "female" ? Gender.female : Gender.other;
    try {
      if (editPatient) {
        await updateMutation.mutateAsync({
          id: editPatient.id,
          name: form.name,
          dateOfBirth: dateToBigIntNanos(form.dateOfBirth),
          gender: genderEnum,
          address: form.address,
          phone: form.phone
        });
        if (form.country) {
          setPatientCountry(editPatient.id, form.country);
        }
        ue.success("Patient updated");
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          dateOfBirth: dateToBigIntNanos(form.dateOfBirth),
          gender: genderEnum,
          address: form.address,
          phone: form.phone
        });
        if (form.country && actor) {
          try {
            const updated = await queryClient.fetchQuery({
              queryKey: ["patients"],
              queryFn: async () => actor.getPatients()
            });
            const newP = [...updated].sort((a, b) => Number(b.createdAt - a.createdAt)).find((p) => p.name === form.name);
            if (newP) setPatientCountry(newP.id, form.country);
          } catch {
          }
        }
        ue.success("New patient added");
      }
      setFormOpen(false);
    } catch {
      ue.error("Failed to save patient");
    }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      ue.success("Patient deleted");
      setDeleteId(null);
    } catch {
      ue.error("Failed to delete patient");
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Patients" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage clinic patient records" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "pasien.open_modal_button",
          onClick: openCreate,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Add Patient"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "pasien.search_input",
          placeholder: "Search by name, patient number, phone, or country...",
          className: "pl-9",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      ),
      search && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
          onClick: () => setSearch(""),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "pasien.empty_state",
        className: "text-center py-12 text-muted-foreground",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: search ? "No patients found" : "No patient records yet" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Patient No." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell", children: "Date of Birth" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell", children: "Gender" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell", children: "Country" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((p, idx) => {
        const country = countryMap[String(p.id)] || "";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `pasien.row.${idx + 1}`,
            className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded", children: p.patientNo }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: formatDate(p.dateOfBirth) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: p.gender === "male" ? "default" : "secondary",
                  className: "text-xs",
                  children: p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : "Other"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: p.phone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: country || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `pasien.edit_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => openEdit(p),
                    className: "h-8 w-8 p-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": `pasien.delete_button.${idx + 1}`,
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setDeleteId(p.id),
                    className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                  }
                )
              ] }) })
            ]
          },
          String(p.id)
        );
      }) })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: formOpen, onOpenChange: setFormOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "pasien.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editPatient ? "Edit Patient" : "Add New Patient" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "name",
              "data-ocid": "pasien.input",
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              placeholder: "Patient's full name",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dob", children: "Date of Birth *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "dob",
              type: "date",
              "data-ocid": "pasien.dob.input",
              value: form.dateOfBirth,
              onChange: (e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value })),
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Gender" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.gender,
              onValueChange: (v) => setForm((f) => ({
                ...f,
                gender: v
              })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "pasien.gender.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "male", children: "Male" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "female", children: "Female" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other", children: "Other" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "address", children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "address",
              "data-ocid": "pasien.address.input",
              value: form.address,
              onChange: (e) => setForm((f) => ({ ...f, address: e.target.value })),
              placeholder: "Full address",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "phone",
              "data-ocid": "pasien.phone.input",
              value: form.phone,
              onChange: (e) => setForm((f) => ({ ...f, phone: e.target.value })),
              placeholder: "Phone number",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Country" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.country,
              onValueChange: (v) => setForm((f) => ({ ...f, country: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    "data-ocid": "pasien.country.select",
                    className: "mt-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select country" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: COUNTRIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "pasien.cancel_button",
            variant: "outline",
            onClick: () => setFormOpen(false),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "pasien.submit_button",
            onClick: handleSubmit,
            disabled: isPending,
            children: isPending ? "Saving..." : editPatient ? "Save Changes" : "Add Patient"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deleteId, onOpenChange: () => setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "pasien.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete Patient?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone. The patient record will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "pasien.cancel_button", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            "data-ocid": "pasien.confirm_button",
            onClick: handleDelete,
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Delete"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  PasienPage as default
};
