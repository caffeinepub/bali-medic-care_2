import { u as useGetPatients, a as useGetServices, b as useCreateInvoice, r as reactExports, j as jsxRuntimeExports, B as Button, c as ue } from "./index-Cj1LDNoz.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Do55eSVE.js";
import { I as Input, P as Plus } from "./Combination-LFyt6rgd.js";
import { L as Label } from "./label-DuCZGXsM.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-gDKftB0e.js";
import { t as todayInputValue, f as formatRupiah, d as dateToBigIntNanos } from "./formatters-DRYxEYqJ.js";
import { A as ArrowLeft } from "./arrow-left-BfcCSedf.js";
import { T as Trash2 } from "./trash-2-CWr4IgiC.js";
const CATEGORIES = [
  "TINDAKAN",
  "OBAT",
  "LABORATORIUM",
  "KONSULTASI",
  "LAINNYA"
];
let _rowCounter = 0;
const emptyRow = () => ({
  _key: `row-${++_rowCounter}`,
  date: todayInputValue(),
  category: "TINDAKAN",
  description: "",
  basePrice: "",
  qty: "1",
  discount: "0"
});
function calcApplied(row) {
  const bp = Number.parseFloat(row.basePrice) || 0;
  const qty = Number.parseFloat(row.qty) || 0;
  const disc = Number.parseFloat(row.discount) || 0;
  return Math.max(0, bp * qty - disc);
}
function CreateInvoicePage({ onSuccess, onCancel }) {
  const { data: patients } = useGetPatients();
  const { data: services } = useGetServices();
  const createMutation = useCreateInvoice();
  const today = todayInputValue();
  const [patientId, setPatientId] = reactExports.useState("");
  const [registrationDate, setRegistrationDate] = reactExports.useState(today);
  const [regNo, setRegNo] = reactExports.useState("");
  const [payer, setPayer] = reactExports.useState("");
  const [dateOfPrinting, setDateOfPrinting] = reactExports.useState(today);
  const [status, setStatus] = reactExports.useState("draft");
  const [lineItems, setLineItems] = reactExports.useState([emptyRow()]);
  const [adminFee, setAdminFee] = reactExports.useState("0");
  const [deposit, setDeposit] = reactExports.useState("0");
  const subtotal = lineItems.reduce((sum, row) => sum + calcApplied(row), 0);
  const adminFeeNum = Number.parseFloat(adminFee) || 0;
  const depositNum = Number.parseFloat(deposit) || 0;
  const totalBill = subtotal + adminFeeNum - depositNum;
  const addRow = () => setLineItems((rows) => [...rows, emptyRow()]);
  const removeRow = (idx) => setLineItems((rows) => rows.filter((_, i) => i !== idx));
  const updateRow = (idx, field, value) => setLineItems(
    (rows) => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row)
  );
  const selectService = (idx, serviceId) => {
    const svc = services == null ? void 0 : services.find((s) => String(s.id) === serviceId);
    if (svc) {
      setLineItems(
        (rows) => rows.map(
          (row, i) => i === idx ? {
            ...row,
            description: svc.name,
            category: svc.category,
            basePrice: String(svc.basePrice)
          } : row
        )
      );
    }
  };
  const handleSubmit = async () => {
    if (!patientId) {
      ue.error("Please select a patient first");
      return;
    }
    if (!regNo) {
      ue.error("Registration number is required");
      return;
    }
    if (lineItems.length === 0) {
      ue.error("Add at least one item");
      return;
    }
    try {
      const items = lineItems.map((row) => ({
        date: dateToBigIntNanos(row.date || today),
        category: row.category,
        description: row.description,
        basePrice: BigInt(Math.round(Number.parseFloat(row.basePrice) || 0)),
        qty: BigInt(Math.round(Number.parseFloat(row.qty) || 1)),
        discount: BigInt(Math.round(Number.parseFloat(row.discount) || 0)),
        appliedCharge: BigInt(Math.round(calcApplied(row)))
      }));
      await createMutation.mutateAsync({
        patientId: BigInt(patientId),
        registrationDate: dateToBigIntNanos(registrationDate),
        regNo,
        payer: payer || null,
        dateOfPrinting: dateToBigIntNanos(dateOfPrinting),
        status,
        lineItems: items
      });
      ue.success("Invoice created successfully");
      onSuccess();
    } catch {
      ue.error("Failed to create invoice");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "invoice.back.button",
          onClick: onCancel,
          className: "p-2 rounded-lg hover:bg-muted transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Create Invoice" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "New Proforma Invoice" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Patient & Registration Info" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Patient *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: patientId, onValueChange: setPatientId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                "data-ocid": "invoice.patient.select",
                className: "mt-1",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select patient" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (patients ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: String(p.id), children: [
              p.name,
              " (",
              p.patientNo,
              ")"
            ] }, String(p.id))) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regDate", children: "Registration Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "regDate",
              type: "date",
              "data-ocid": "invoice.reg_date.input",
              value: registrationDate,
              onChange: (e) => setRegistrationDate(e.target.value),
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "regNo", children: "Registration Number *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "regNo",
              "data-ocid": "invoice.reg_no.input",
              value: regNo,
              onChange: (e) => setRegNo(e.target.value),
              placeholder: "e.g. OPDN25",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payer", children: "Payer / Guarantor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "payer",
              "data-ocid": "invoice.payer.input",
              value: payer,
              onChange: (e) => setPayer(e.target.value),
              placeholder: "Optional",
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "printDate", children: "Print Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "printDate",
              type: "date",
              "data-ocid": "invoice.print_date.input",
              value: dateOfPrinting,
              onChange: (e) => setDateOfPrinting(e.target.value),
              className: "mt-1"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: status,
              onValueChange: (v) => setStatus(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "invoice.status.select", className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "final", children: "Final" })
                ] })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Service Items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "invoice.add_item.button",
            variant: "outline",
            size: "sm",
            onClick: addRow,
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Add Item"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "From Catalog" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Qty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Discount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 text-xs font-semibold text-muted-foreground", children: "Charge" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2.5" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lineItems.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `invoice.item.${idx + 1}`,
            className: "border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: row.date,
                  onChange: (e) => updateRow(idx, "date", e.target.value),
                  className: "w-32 h-8 text-xs"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (v) => selectService(idx, v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36 h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select..." }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (services ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(s.id), children: s.name }, String(s.id))) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: row.category,
                  onValueChange: (v) => updateRow(idx, "category", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32 h-8 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: row.description,
                  onChange: (e) => updateRow(idx, "description", e.target.value),
                  placeholder: "Description",
                  className: "w-44 h-8 text-xs"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: row.basePrice,
                  onChange: (e) => updateRow(idx, "basePrice", e.target.value),
                  placeholder: "0",
                  className: "w-28 h-8 text-xs text-right"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: row.qty,
                  onChange: (e) => updateRow(idx, "qty", e.target.value),
                  className: "w-14 h-8 text-xs text-center",
                  min: "1"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: row.discount,
                  onChange: (e) => updateRow(idx, "discount", e.target.value),
                  placeholder: "0",
                  className: "w-24 h-8 text-xs text-right"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-medium text-sm whitespace-nowrap", children: formatRupiah(calcApplied(row)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": `invoice.remove_item.button.${idx + 1}`,
                  variant: "ghost",
                  size: "sm",
                  onClick: () => removeRow(idx),
                  disabled: lineItems.length === 1,
                  className: "h-8 w-8 p-0 text-destructive hover:bg-destructive/10",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              ) })
            ]
          },
          row._key
        )) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xs ml-auto space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatRupiah(subtotal) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground whitespace-nowrap", children: "Admin Fee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            "data-ocid": "invoice.admin_fee.input",
            value: adminFee,
            onChange: (e) => setAdminFee(e.target.value),
            className: "w-32 h-8 text-xs text-right"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Deposit / Deduction" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            "data-ocid": "invoice.deposit.input",
            value: deposit,
            onChange: (e) => setDeposit(e.target.value),
            className: "w-32 h-8 text-xs text-right"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 flex justify-between font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total Bill" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-lg font-display", children: formatRupiah(Math.max(0, totalBill)) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "invoice.cancel_button",
          variant: "outline",
          onClick: onCancel,
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "invoice.submit_button",
          onClick: handleSubmit,
          disabled: createMutation.isPending,
          children: createMutation.isPending ? "Saving..." : "Save Invoice"
        }
      )
    ] })
  ] });
}
export {
  CreateInvoicePage as default
};
