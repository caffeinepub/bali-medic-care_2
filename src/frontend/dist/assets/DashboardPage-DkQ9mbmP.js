import { d as createLucideIcon, u as useGetPatients, e as useGetInvoices, f as useGetSickNotes, g as useGetHealthCertificates, U as Users, F as FileText, H as Heart, j as jsxRuntimeExports, B as Button, C as Cross } from "./index-Cj1LDNoz.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-Do55eSVE.js";
import { S as Skeleton } from "./skeleton-yQPGKswp.js";
import { a as formatDate, f as formatRupiah } from "./formatters-DRYxEYqJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function DashboardPage({ navigate }) {
  var _a, _b, _c, _d;
  const patients = useGetPatients();
  const invoices = useGetInvoices();
  const sickNotes = useGetSickNotes();
  const healthCerts = useGetHealthCertificates();
  const today = /* @__PURE__ */ new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const todayEnd = todayStart + 864e5;
  const invoicesToday = (invoices.data ?? []).filter((inv) => {
    const ms = Number(inv.dateOfPrinting / BigInt(1e6));
    return ms >= todayStart && ms < todayEnd;
  });
  const totalDocuments = (((_a = sickNotes.data) == null ? void 0 : _a.length) ?? 0) + (((_b = healthCerts.data) == null ? void 0 : _b.length) ?? 0);
  const recentInvoices = [...invoices.data ?? []].sort((a, b) => Number(b.dateOfPrinting - a.dateOfPrinting)).slice(0, 5);
  const recentPatients = [...patients.data ?? []].sort((a, b) => Number(b.createdAt - a.createdAt)).slice(0, 5);
  const stats = [
    {
      id: "total-pasien",
      label: "Total Patients",
      value: ((_c = patients.data) == null ? void 0 : _c.length) ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      isLoading: patients.isLoading
    },
    {
      id: "invoice-today",
      label: "Today's Invoices",
      value: invoicesToday.length,
      icon: FileText,
      color: "bg-teal-50 text-teal-600",
      isLoading: invoices.isLoading
    },
    {
      id: "total-invoice",
      label: "Total Invoices",
      value: ((_d = invoices.data) == null ? void 0 : _d.length) ?? 0,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
      isLoading: invoices.isLoading
    },
    {
      id: "total-surat",
      label: "Total Documents",
      value: totalDocuments,
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
      isLoading: sickNotes.isLoading || healthCerts.isLoading
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "dashboard.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
        "Bali Medic Care —",
        " ",
        formatDate(BigInt(Date.now()) * BigInt(1e6))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((stat) => {
      const Icon = stat.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: stat.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground font-display", children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label })
      ] }) }) }, stat.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Quick Actions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "dashboard.invoice.primary_button",
            onClick: () => navigate("invoice-create"),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-4 h-4" }),
              "New Invoice"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "dashboard.surat-sakit.secondary_button",
            variant: "outline",
            onClick: () => navigate("surat-sakit"),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Cross, { className: "w-4 h-4" }),
              "Sick Note"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "dashboard.surat-sehat.secondary_button",
            variant: "outline",
            onClick: () => navigate("surat-sehat"),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-4 h-4" }),
              "Health Certificate"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "dashboard.pasien.secondary_button",
            variant: "outline",
            onClick: () => navigate("pasien"),
            className: "gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
              "Add Patient"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Recent Invoices" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: invoices.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : recentInvoices.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "invoice.empty_state",
            className: "text-center py-6 text-muted-foreground text-sm",
            children: "No invoices yet"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentInvoices.map((inv, idx) => {
          var _a2;
          const total = inv.lineItems.reduce(
            (sum, li) => sum + Number(li.appliedCharge),
            0
          );
          const patient = (_a2 = patients.data) == null ? void 0 : _a2.find(
            (p) => p.id === inv.patientId
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `invoice.item.${idx + 1}`,
              className: "flex items-center justify-between py-2 border-b border-border last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: (patient == null ? void 0 : patient.name) ?? "–" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    inv.regNo,
                    " · ",
                    formatDate(inv.dateOfPrinting)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: formatRupiah(total) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-[10px] px-1.5 py-0.5 rounded font-medium ${inv.status === "final" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`,
                      children: inv.status === "final" ? "Final" : "Draft"
                    }
                  )
                ] })
              ]
            },
            String(inv.id)
          );
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-display", children: "Recent Patients" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: patients.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : recentPatients.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "pasien.empty_state",
            className: "text-center py-6 text-muted-foreground text-sm",
            children: "No patient data yet"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: recentPatients.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `pasien.item.${idx + 1}`,
            className: "flex items-center justify-between py-2 border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: p.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  p.patientNo,
                  " ·",
                  " ",
                  p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : "Other"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(p.createdAt) })
            ]
          },
          String(p.id)
        )) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "text-center py-4 text-xs text-muted-foreground border-t border-border", children: "© 2026. Built with Lingga" })
  ] });
}
export {
  DashboardPage as default
};
