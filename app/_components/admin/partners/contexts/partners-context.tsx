"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Pharmacy,
  PharmacyUser,
  Product,
  PartnerInvoice,
  PartnerPayment,
  FeeTier,
  CsvJob,
  OrderRecord,
  PartnerComment,
  ReconciliationSummary,
} from "@/types/partners";
import { showSuccessToast } from "@/lib/toast";

export const CATEGORIES = [
  "Analgesics",
  "Antibiotics",
  "Dermatology",
  "Vitamins & Supplements",
  "Cardiology",
  "Diabetes Care",
  "Programs",
];

export const CURRENT_PERIOD = "July, 2026";
export const VAT_RATE = 7.5; // Nigeria standard VAT percentage

const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: "ph1",
    name: "Lagos Central Pharmacy",
    city: "Lagos",
    country: "Nigeria",
    email: "contact@lagoscentralrx.com",
    phone: "+234 801 234 5678",
    status: "active",
    fulfillment: "delivery",
    feeType: "volume_based",
    flatFeeAmount: null,
    cadence: "monthly",
  },
  {
    id: "ph2",
    name: "Rivers Health Pharmacy",
    city: "Port Harcourt",
    country: "Nigeria",
    email: "info@rivershealthrx.com",
    phone: "+234 802 345 6789",
    status: "active",
    fulfillment: "delivery",
    feeType: "flat",
    flatFeeAmount: 15000,
    cadence: "biweekly",
  },
  {
    id: "ph3",
    name: "Abuja Wellness Chemist",
    city: "Abuja",
    country: "Nigeria",
    email: "hello@abujawellness.com",
    phone: "+234 803 456 7890",
    status: "inactive",
    fulfillment: "pickup",
    feeType: "volume_based",
    flatFeeAmount: null,
    cadence: "monthly",
  },
  {
    id: "ph4",
    name: "Kano MedPoint",
    city: "Kano",
    country: "Nigeria",
    email: "ops@kanomedpoint.com",
    phone: "+234 804 567 8901",
    status: "active",
    fulfillment: "pickup",
    feeType: "flat",
    flatFeeAmount: 9000,
    cadence: "biweekly",
  },
];

const INITIAL_USERS: PharmacyUser[] = [
  {
    id: "pu1",
    pharmacyId: "ph1",
    title: "Mr.",
    first: "Tunde",
    last: "Bakare",
    email: "tunde@lagoscentralrx.com",
    role: "Pharmacy Admin",
    status: "active",
  },
  {
    id: "pu2",
    pharmacyId: "ph1",
    title: "Mrs.",
    first: "Chidinma",
    last: "Eze",
    email: "chidinma@lagoscentralrx.com",
    role: "Pharmacy Staff",
    status: "active",
  },
  {
    id: "pu3",
    pharmacyId: "ph2",
    title: "Dr.",
    first: "Ifeoma",
    last: "Okafor",
    email: "ifeoma@rivershealthrx.com",
    role: "Pharmacy Admin",
    status: "active",
  },
  {
    id: "pu4",
    pharmacyId: "ph4",
    title: "Mr.",
    first: "Sani",
    last: "Musa",
    email: "sani@kanomedpoint.com",
    role: "Pharmacy Admin",
    status: "deactivated",
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    pharmacyId: "ph1",
    category: "Analgesics",
    productType: "single",
    name: "Paracetamol 500mg",
    dateCreated: "01 Jul 2026",
    qty: 2400,
    unit: "tablet",
    pricePerUnit: 12,
    aggregatePrice: 28800,
    pharmaId: "PH-10021",
    batchId: "B-2026-0071",
    barcode: "6009800100019",
    manufacturerPrice: 9,
    pharmaceuticalPrice: 12,
    htvMarkup: 3,
    htvPrice: 15,
    markupVisible: true,
    unitsSold90d: 5200,
    stockLog: [
      {
        date: "01 Jul 2026",
        change: 2000,
        reason: "Initial stock",
        by: "Tunde Bakare",
      },
      {
        date: "15 Jul 2026",
        change: 400,
        reason: "Restock",
        by: "Tunde Bakare",
      },
    ],
  },
  {
    id: "p2",
    pharmacyId: "ph1",
    category: "Antibiotics",
    productType: "single",
    name: "Amoxicillin 250mg",
    dateCreated: "03 Jul 2026",
    qty: 900,
    unit: "capsule",
    pricePerUnit: 45,
    aggregatePrice: 40500,
    pharmaId: "PH-10022",
    batchId: "B-2026-0072",
    barcode: "6009800100026",
    manufacturerPrice: 32,
    pharmaceuticalPrice: 45,
    htvMarkup: 13,
    htvPrice: 58,
    markupVisible: false,
    unitsSold90d: 1800,
    stockLog: [
      {
        date: "03 Jul 2026",
        change: 900,
        reason: "Initial stock",
        by: "Tunde Bakare",
      },
    ],
  },
  {
    id: "p3",
    pharmacyId: "ph1",
    category: "Vitamins & Supplements",
    productType: "single",
    name: "Vitamin C 1000mg",
    dateCreated: "05 Jul 2026",
    qty: 1500,
    unit: "tablet",
    pricePerUnit: 20,
    aggregatePrice: 30000,
    pharmaId: "PH-10023",
    batchId: "B-2026-0073",
    barcode: "6009800100033",
    manufacturerPrice: 11,
    pharmaceuticalPrice: 20,
    htvMarkup: 7,
    htvPrice: 27,
    markupVisible: true,
    unitsSold90d: 4100,
    stockLog: [
      {
        date: "05 Jul 2026",
        change: 1500,
        reason: "Initial stock",
        by: "Chidinma Eze",
      },
    ],
  },
  {
    id: "p4",
    pharmacyId: "ph2",
    category: "Diabetes Care",
    productType: "single",
    name: "Metformin 500mg",
    dateCreated: "02 Jul 2026",
    qty: 600,
    unit: "tablet",
    pricePerUnit: 38,
    aggregatePrice: 22800,
    pharmaId: "PH-10024",
    batchId: "B-2026-0074",
    barcode: "6009800100040",
    manufacturerPrice: 26,
    pharmaceuticalPrice: 38,
    htvMarkup: 11,
    htvPrice: 49,
    markupVisible: true,
    unitsSold90d: 2600,
    stockLog: [
      {
        date: "02 Jul 2026",
        change: 600,
        reason: "Initial stock",
        by: "Ifeoma Okafor",
      },
    ],
  },
  {
    id: "p5",
    pharmacyId: "ph2",
    category: "Cardiology",
    productType: "single",
    name: "Amlodipine 5mg",
    dateCreated: "02 Jul 2026",
    qty: 450,
    unit: "tablet",
    pricePerUnit: 52,
    aggregatePrice: 23400,
    pharmaId: "PH-10025",
    batchId: "B-2026-0075",
    barcode: "6009800100057",
    manufacturerPrice: 37,
    pharmaceuticalPrice: 52,
    htvMarkup: 18,
    htvPrice: 70,
    markupVisible: false,
    unitsSold90d: 900,
    stockLog: [
      {
        date: "02 Jul 2026",
        change: 450,
        reason: "Initial stock",
        by: "Ifeoma Okafor",
      },
    ],
  },
  {
    id: "p6",
    pharmacyId: "ph4",
    category: "Dermatology",
    productType: "single",
    name: "Hydrocortisone Cream 1%",
    dateCreated: "04 Jul 2026",
    qty: 320,
    unit: "tube",
    pricePerUnit: 65,
    aggregatePrice: 20800,
    pharmaId: "PH-10026",
    batchId: "B-2026-0076",
    barcode: "6009800100064",
    manufacturerPrice: 41,
    pharmaceuticalPrice: 65,
    htvMarkup: 17,
    htvPrice: 82,
    markupVisible: true,
    unitsSold90d: 610,
    stockLog: [
      {
        date: "04 Jul 2026",
        change: 320,
        reason: "Initial stock",
        by: "Sani Musa",
      },
    ],
  },
  {
    id: "p7",
    pharmacyId: "ph1",
    category: "Analgesics",
    productType: "single",
    name: "Ibuprofen 400mg",
    dateCreated: "06 Jul 2026",
    qty: 1800,
    unit: "tablet",
    pricePerUnit: 16,
    aggregatePrice: 28800,
    pharmaId: "PH-10027",
    batchId: "B-2026-0077",
    barcode: "6009800100071",
    manufacturerPrice: 10,
    pharmaceuticalPrice: 16,
    htvMarkup: 5,
    htvPrice: 21,
    markupVisible: true,
    unitsSold90d: 3300,
    stockLog: [
      {
        date: "06 Jul 2026",
        change: 1800,
        reason: "Initial stock",
        by: "Tunde Bakare",
      },
    ],
  },
  {
    id: "p8",
    pharmacyId: "ph1",
    category: "Programs",
    productType: "program",
    name: "Weight Loss Starter Program",
    dateCreated: "10 Jul 2026",
    qty: 60,
    unit: "program",
    pricePerUnit: 220,
    aggregatePrice: 13200,
    pharmaId: "PH-10028",
    batchId: "B-2026-0079",
    barcode: "6009800100088",
    manufacturerPrice: 150,
    pharmaceuticalPrice: 220,
    htvMarkup: 60,
    htvPrice: 280,
    markupVisible: false,
    unitsSold90d: 140,
    stockLog: [
      {
        date: "10 Jul 2026",
        change: 60,
        reason: "Initial stock",
        by: "Tunde Bakare",
      },
    ],
    components: [
      { productId: "p1", qty: 60 },
      { productId: "p3", qty: 30 },
    ],
  },
];

const INITIAL_INVOICES: PartnerInvoice[] = [
  {
    id: "inv1",
    direction: "htv_to_pharmacy",
    pharmacyId: "ph1",
    number: "HTV-INV-2607040231A",
    month: "July, 2026",
    amount: 284500,
    status: "paid",
    dateCreated: "04 Jul 2026",
    lines: [
      {
        desc: "Paracetamol 500mg — 1,200 units",
        qty: 1200,
        unitPrice: 15,
        amount: 18000,
        type: "product",
      },
      {
        desc: "Amoxicillin 250mg — 400 units",
        qty: 400,
        unitPrice: 58,
        amount: 23200,
        type: "product",
      },
      {
        desc: "Platform fee — Tier 2 (5,001–20,000 units)",
        qty: null,
        unitPrice: null,
        amount: 6200,
        type: "platform_fee",
      },
    ],
  },
  {
    id: "inv2",
    direction: "pharmacy_to_htv",
    pharmacyId: "ph1",
    number: "HTV-INV-2607120144A",
    month: "July, 2026",
    amount: 31500,
    status: "under_review",
    dateCreated: "12 Jul 2026",
    lines: [
      {
        desc: "Consignment restock — Vitamin C 1000mg",
        qty: 1500,
        unitPrice: 20,
        amount: 30000,
        type: "product",
      },
      {
        desc: "Handling adjustment",
        qty: null,
        unitPrice: null,
        amount: 1500,
        type: "product",
      },
    ],
  },
  {
    id: "inv3",
    direction: "htv_to_pharmacy",
    pharmacyId: "ph2",
    number: "HTV-INV-2606280093A",
    month: "June, 2026",
    amount: 98300,
    status: "paid",
    dateCreated: "28 Jun 2026",
    lines: [
      {
        desc: "Metformin 500mg — 600 units",
        qty: 600,
        unitPrice: 49,
        amount: 29400,
        type: "product",
      },
      {
        desc: "Platform fee — Tier 1 (0–5,000 units)",
        qty: null,
        unitPrice: null,
        amount: 2100,
        type: "platform_fee",
      },
    ],
  },
];

const INITIAL_PAYMENTS: PartnerPayment[] = [
  {
    id: "pay1",
    invoiceId: "inv1",
    method: "adyen",
    amount: 284500,
    paidAt: "04 Jul 2026",
    reference: "ADY-88213",
  },
  {
    id: "pay2",
    invoiceId: "inv3",
    method: "bank_transfer",
    amount: 98300,
    paidAt: "29 Jun 2026",
    reference: "BT-55021",
  },
];

const INITIAL_FEE_TIERS: FeeTier[] = [
  { id: "ft1", min: 0, max: 5000, rate: 4 },
  { id: "ft2", min: 5001, max: 20000, rate: 3.25 },
  { id: "ft3", min: 20001, max: null, rate: 2.5 },
];

const INITIAL_CSV_JOBS: CsvJob[] = [
  {
    id: "job1",
    pharmacyId: "ph1",
    jobType: "inventory",
    period: "July, 2026",
    committedAt: "01 Jul 2026",
    rowCount: 5,
  },
];

const INITIAL_COMMENTS: PartnerComment[] = [
  {
    id: "c1",
    entityType: "invoice",
    entityId: "inv2",
    author: "Tunde Bakare (Pharmacy)",
    text: "This invoice includes a handling adjustment we weren't expecting — can you confirm what this covers?",
    date: "13 Jul 2026",
  },
  {
    id: "c2",
    entityType: "invoice",
    entityId: "inv2",
    author: "Dr. Adaora Isaac (Admin)",
    text: "Checking with ops, will follow up by EOD.",
    date: "13 Jul 2026",
  },
];

type PartnersContextType = {
  pharmacies: Pharmacy[];
  users: PharmacyUser[];
  products: Product[];
  invoices: PartnerInvoice[];
  payments: PartnerPayment[];
  feeTiers: FeeTier[];
  csvJobs: CsvJob[];
  orders: OrderRecord[];
  comments: PartnerComment[];
  portalView: "admin" | "pharmacy";
  portalPharmacyId: string;
  portalTab: "dashboard" | "products" | "invoices" | "team";
  setPortalView: (view: "admin" | "pharmacy") => void;
  setPortalPharmacyId: (id: string) => void;
  setPortalTab: (tab: "dashboard" | "products" | "invoices" | "team") => void;

  // Pharmacy CRUD
  addPharmacy: (data: Omit<Pharmacy, "id">) => string;
  updatePharmacy: (id: string, data: Partial<Pharmacy>) => void;
  togglePharmacyStatus: (id: string) => void;
  deletePharmacy: (id: string) => void;

  // User CRUD
  addUser: (data: Omit<PharmacyUser, "id">) => void;
  updateUser: (id: string, data: Partial<PharmacyUser>) => void;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => void;

  // Product CRUD
  addProduct: (data: Omit<Product, "id">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  adjustStock: (productId: string, change: number, reason: string, by?: string) => void;
  toggleMarkupVisible: (id: string) => void;
  deleteProduct: (id: string) => void;

  // Invoice & Payment Operations
  createInvoice: (data: Omit<PartnerInvoice, "id" | "dateCreated">) => void;
  recordPayment: (data: Omit<PartnerPayment, "id">) => void;
  getPaymentsForInvoice: (invoiceId: string) => PartnerPayment[];
  getPaidAmountForInvoice: (invoiceId: string) => number;

  // Comments
  getComments: (entityType: "invoice" | "reconciliation", entityId: string) => PartnerComment[];
  addComment: (entityType: "invoice" | "reconciliation", entityId: string, author: string, text: string) => void;

  // Fee Tiers
  addFeeTier: (data: Omit<FeeTier, "id">) => void;
  updateFeeTier: (id: string, data: Partial<FeeTier>) => void;
  deleteFeeTier: (id: string) => void;

  // CSV Wizards & Reconciliation
  checkDuplicateJob: (pharmacyId: string, jobType: "inventory" | "orders_fulfilled", period: string) => CsvJob | undefined;
  commitInventoryCsv: (pharmacyId: string, period: string, rowCount: number) => void;
  commitOrdersCsv: (pharmacyId: string, period: string, records: Omit<OrderRecord, "id">[]) => void;
  computeReconciliation: (ph: Pharmacy) => ReconciliationSummary;
  generateInvoiceFromReconciliation: (pharmacyId: string) => string;
};

const PartnersContext = createContext<PartnersContextType | null>(null);

export function PartnersProvider({ children }: { children: ReactNode }) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(INITIAL_PHARMACIES);
  const [users, setUsers] = useState<PharmacyUser[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [invoices, setInvoices] = useState<PartnerInvoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PartnerPayment[]>(INITIAL_PAYMENTS);
  const [feeTiers, setFeeTiers] = useState<FeeTier[]>(INITIAL_FEE_TIERS);
  const [csvJobs, setCsvJobs] = useState<CsvJob[]>(INITIAL_CSV_JOBS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [comments, setComments] = useState<PartnerComment[]>(INITIAL_COMMENTS);
  const [portalView, setPortalView] = useState<"admin" | "pharmacy">("admin");
  const [portalPharmacyId, setPortalPharmacyId] = useState<string>("ph1");
  const [portalTab, setPortalTab] = useState<"dashboard" | "products" | "invoices" | "team">("dashboard");

  // Pharmacy Actions
  const addPharmacy = useCallback((data: Omit<Pharmacy, "id">) => {
    const id = "ph_" + Date.now().toString().slice(-6);
    const newPharmacy: Pharmacy = { id, ...data };
    setPharmacies((prev) => [newPharmacy, ...prev]);
    showSuccessToast(`Pharmacy "${data.name}" created successfully`);
    return id;
  }, []);

  const updatePharmacy = useCallback((id: string, data: Partial<Pharmacy>) => {
    setPharmacies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showSuccessToast("Pharmacy updated successfully");
  }, []);

  const togglePharmacyStatus = useCallback((id: string) => {
    setPharmacies((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "active" ? "inactive" : "active";
          showSuccessToast(
            `${p.name} ${nextStatus === "active" ? "reactivated" : "deactivated"} (soft, reversible)`
          );
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  }, []);

  const deletePharmacy = useCallback((id: string) => {
    setPharmacies((prev) => {
      const p = prev.find((x) => x.id === id);
      if (p) {
        showSuccessToast(`${p.name} deleted (soft-delete)`);
      }
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  // User Actions
  const addUser = useCallback((data: Omit<PharmacyUser, "id">) => {
    const id = "pu_" + Date.now().toString().slice(-6);
    const newUser: PharmacyUser = { id, ...data };
    setUsers((prev) => [...prev, newUser]);
    showSuccessToast("Pharmacy user added successfully");
  }, []);

  const updateUser = useCallback((id: string, data: Partial<PharmacyUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
    showSuccessToast("Pharmacy user updated successfully");
  }, []);

  const toggleUserStatus = useCallback((id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "active" ? "deactivated" : "active";
          showSuccessToast(
            `User ${nextStatus === "active" ? "reactivated" : "deactivated"}`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  }, []);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showSuccessToast("User deleted (soft-delete)");
  }, []);

  // Product Actions
  const addProduct = useCallback((data: Omit<Product, "id">) => {
    const id = "p_" + Date.now().toString().slice(-6);
    const newProd: Product = { id, ...data };
    setProducts((prev) => [newProd, ...prev]);
    showSuccessToast(`Product "${data.name}" added successfully`);
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...data };
          if (data.pricePerUnit !== undefined || data.qty !== undefined) {
            updated.aggregatePrice = updated.pricePerUnit * updated.qty;
          }
          if (
            data.pharmaceuticalPrice !== undefined ||
            data.htvMarkup !== undefined
          ) {
            updated.htvPrice =
              updated.pharmaceuticalPrice + updated.htvMarkup;
          }
          return updated;
        }
        return p;
      })
    );
    showSuccessToast("Product updated successfully");
  }, []);

  const adjustStock = useCallback(
    (productId: string, change: number, reason: string, by = "Admin") => {
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            const nextQty = Math.max(0, p.qty + change);
            const nextAgg = nextQty * p.pricePerUnit;
            const nextLog = [
              ...(p.stockLog || []),
              { date: today, change, reason, by },
            ];
            return {
              ...p,
              qty: nextQty,
              aggregatePrice: nextAgg,
              stockLog: nextLog,
            };
          }
          return p;
        })
      );
      showSuccessToast(
        `Stock ${change >= 0 ? "increased" : "decreased"} by ${Math.abs(change)}`
      );
    },
    []
  );

  const toggleMarkupVisible = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.markupVisible;
          showSuccessToast(
            `HTV markup on ${p.name} is now ${next ? "visible" : "hidden"} to the pharmacy`
          );
          return { ...p, markupVisible: next };
        }
        return p;
      })
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showSuccessToast("Product deleted successfully");
  }, []);

  // Invoice & Payments
  const createInvoice = useCallback(
    (data: Omit<PartnerInvoice, "id" | "dateCreated">) => {
      const id = "inv_" + Date.now().toString().slice(-6);
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const newInv: PartnerInvoice = {
        id,
        dateCreated: today,
        ...data,
      };
      setInvoices((prev) => [newInv, ...prev]);
      showSuccessToast(`Invoice ${data.number} created successfully`);
    },
    []
  );

  const recordPayment = useCallback((data: Omit<PartnerPayment, "id">) => {
    const id = "pay_" + Date.now().toString().slice(-6);
    const newPay: PartnerPayment = { id, ...data };
    setPayments((prev) => [...prev, newPay]);

    // Check if invoice is fully settled
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === data.invoiceId) {
          const currentPaid = payments
            .filter((p) => p.invoiceId === inv.id)
            .reduce((s, p) => s + p.amount, 0);
          const totalPaid = currentPaid + data.amount;
          if (totalPaid >= inv.amount) {
            return { ...inv, status: "paid" };
          }
        }
        return inv;
      })
    );
    showSuccessToast("Payment recorded successfully");
  }, [payments]);

  const getPaymentsForInvoice = useCallback(
    (invoiceId: string) => payments.filter((p) => p.invoiceId === invoiceId),
    [payments]
  );

  const getPaidAmountForInvoice = useCallback(
    (invoiceId: string) =>
      payments
        .filter((p) => p.invoiceId === invoiceId)
        .reduce((s, p) => s + p.amount, 0),
    [payments]
  );

  // Comments
  const getComments = useCallback(
    (entityType: "invoice" | "reconciliation", entityId: string) =>
      comments.filter(
        (c) => c.entityType === entityType && c.entityId === entityId
      ),
    [comments]
  );

  const addComment = useCallback(
    (
      entityType: "invoice" | "reconciliation",
      entityId: string,
      author: string,
      text: string
    ) => {
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const id = "c_" + Date.now().toString().slice(-6);
      setComments((prev) => [
        ...prev,
        { id, entityType, entityId, author, text, date: today },
      ]);
      showSuccessToast("Comment posted");
    },
    []
  );

  // Fee Tiers
  const addFeeTier = useCallback((data: Omit<FeeTier, "id">) => {
    const id = "ft_" + Date.now().toString().slice(-6);
    setFeeTiers((prev) => [...prev, { id, ...data }]);
    showSuccessToast("Fee tier created successfully");
  }, []);

  const updateFeeTier = useCallback((id: string, data: Partial<FeeTier>) => {
    setFeeTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    showSuccessToast("Fee tier updated successfully");
  }, []);

  const deleteFeeTier = useCallback((id: string) => {
    setFeeTiers((prev) => prev.filter((t) => t.id !== id));
    showSuccessToast("Fee tier deleted");
  }, []);

  // CSV Wizards & Reconciliation
  const checkDuplicateJob = useCallback(
    (
      pharmacyId: string,
      jobType: "inventory" | "orders_fulfilled",
      period: string
    ) => {
      return csvJobs.find(
        (j) =>
          j.pharmacyId === pharmacyId &&
          j.jobType === jobType &&
          j.period === period
      );
    },
    [csvJobs]
  );

  const commitInventoryCsv = useCallback(
    (pharmacyId: string, period: string, rowCount: number) => {
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setCsvJobs((prev) => {
        const existingIndex = prev.findIndex(
          (j) =>
            j.pharmacyId === pharmacyId &&
            j.jobType === "inventory" &&
            j.period === period
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            committedAt: today,
            rowCount,
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: "job_" + Date.now().toString().slice(-6),
            pharmacyId,
            jobType: "inventory",
            period,
            committedAt: today,
            rowCount,
          },
        ];
      });
      showSuccessToast(
        `Inventory CSV committed — ${rowCount} rows imported successfully`
      );
    },
    []
  );

  const commitOrdersCsv = useCallback(
    (
      pharmacyId: string,
      period: string,
      records: Omit<OrderRecord, "id">[]
    ) => {
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      // Replace prior committed orders for this pharmacy & period
      setOrders((prev) => {
        const filtered = prev.filter(
          (o) => !(o.pharmacyId === pharmacyId && o.period === period)
        );
        const newRecords: OrderRecord[] = records.map((r, i) => ({
          id: `ord_${Date.now().toString().slice(-6)}_${i}`,
          ...r,
        }));
        return [...filtered, ...newRecords];
      });

      setCsvJobs((prev) => {
        const existingIndex = prev.findIndex(
          (j) =>
            j.pharmacyId === pharmacyId &&
            j.jobType === "orders_fulfilled" &&
            j.period === period
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            committedAt: today,
            rowCount: records.length,
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: "job_" + Date.now().toString().slice(-6),
            pharmacyId,
            jobType: "orders_fulfilled",
            period,
            committedAt: today,
            rowCount: records.length,
          },
        ];
      });

      showSuccessToast(
        `Orders Fulfilled CSV committed — ${records.length} orders recorded, reconciliation updated`
      );
    },
    []
  );

  const computeReconciliation = useCallback(
    (ph: Pharmacy): ReconciliationSummary => {
      const phProducts = products.filter((p) => p.pharmacyId === ph.id);
      const periodOrders = orders.filter(
        (o) => o.pharmacyId === ph.id && o.period === CURRENT_PERIOD
      );
      const usingRealOrders = periodOrders.length > 0;

      const csvTotal = usingRealOrders
        ? periodOrders.reduce((s, o) => s + o.amount, 0)
        : phProducts.reduce((s, p) => s + p.htvPrice * p.unitsSold90d, 0);

      const phInvoices = invoices.filter((i) => i.pharmacyId === ph.id);
      const invIds = phInvoices.map((i) => i.id);
      const phPayments = payments.filter((p) => invIds.includes(p.invoiceId));

      const paidAdyen = phPayments
        .filter((p) => p.method === "adyen")
        .reduce((s, p) => s + p.amount, 0);
      const paidBank = phPayments
        .filter((p) => p.method === "bank_transfer")
        .reduce((s, p) => s + p.amount, 0);

      const outstanding = csvTotal - (paidAdyen + paidBank);
      const totalMarkup = phProducts.reduce(
        (s, p) => s + p.htvMarkup * p.unitsSold90d,
        0
      );
      const totalVolume = phProducts.reduce(
        (s, p) => s + p.unitsSold90d,
        0
      );

      let platformFees = 0;
      if (ph.feeType === "flat") {
        platformFees = ph.flatFeeAmount || 0;
      } else {
        const tier =
          feeTiers.find(
            (t) =>
              totalVolume >= t.min && (t.max === null || totalVolume <= t.max)
          ) || feeTiers[feeTiers.length - 1];
        platformFees = tier ? csvTotal * (tier.rate / 100) : 0;
      }

      const finalAmount = outstanding - totalMarkup + platformFees;

      return {
        ph,
        csvTotal,
        paidAdyen,
        paidBank,
        outstanding,
        totalMarkup,
        platformFees,
        finalAmount,
        usingRealOrders,
      };
    },
    [products, orders, invoices, payments, feeTiers]
  );

  const generateInvoiceFromReconciliation = useCallback(
    (pharmacyId: string) => {
      const ph = pharmacies.find((p) => p.id === pharmacyId);
      if (!ph) return "";
      const r = computeReconciliation(ph);
      const invoiceNumber =
        "HTV-INV-" + Date.now().toString().slice(-10) + "A";
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const newInvoice: PartnerInvoice = {
        id: "inv_" + Date.now().toString().slice(-6),
        direction: "htv_to_pharmacy",
        pharmacyId: ph.id,
        number: invoiceNumber,
        month: CURRENT_PERIOD,
        amount: r.finalAmount,
        status: "under_review",
        dateCreated: today,
        lines: [
          {
            desc: `CSV Fulfilled Total, ${CURRENT_PERIOD}${
              r.usingRealOrders
                ? " (committed orders CSV)"
                : " (approximated — no committed orders CSV)"
            }`,
            qty: null,
            unitPrice: null,
            amount: r.csvTotal,
            type: "product",
          },
          {
            desc: `Less: payments received (Adyen €${r.paidAdyen.toLocaleString()} + Bank Transfer €${r.paidBank.toLocaleString()})`,
            qty: null,
            unitPrice: null,
            amount: -(r.paidAdyen + r.paidBank),
            type: "product",
          },
          {
            desc: "Less: HTV markup already retained",
            qty: null,
            unitPrice: null,
            amount: -r.totalMarkup,
            type: "product",
          },
          {
            desc: `Platform fee (${
              ph.feeType === "flat"
                ? `Flat fee — €${ph.flatFeeAmount}/mo`
                : "Tiered volume schedule"
            })`,
            qty: null,
            unitPrice: null,
            amount: r.platformFees,
            type: "platform_fee",
          },
        ],
      };

      setInvoices((prev) => [newInvoice, ...prev]);
      showSuccessToast(
        `Invoice ${invoiceNumber} generated from reconciliation for ${ph.name} (Under Review)`
      );
      return newInvoice.id;
    },
    [pharmacies, computeReconciliation]
  );

  const value = useMemo(
    () => ({
      pharmacies,
      users,
      products,
      invoices,
      payments,
      feeTiers,
      csvJobs,
      orders,
      comments,
      portalView,
      portalPharmacyId,
      portalTab,
      setPortalView,
      setPortalPharmacyId,
      setPortalTab,
      addPharmacy,
      updatePharmacy,
      togglePharmacyStatus,
      deletePharmacy,
      addUser,
      updateUser,
      toggleUserStatus,
      deleteUser,
      addProduct,
      updateProduct,
      adjustStock,
      toggleMarkupVisible,
      deleteProduct,
      createInvoice,
      recordPayment,
      getPaymentsForInvoice,
      getPaidAmountForInvoice,
      getComments,
      addComment,
      addFeeTier,
      updateFeeTier,
      deleteFeeTier,
      checkDuplicateJob,
      commitInventoryCsv,
      commitOrdersCsv,
      computeReconciliation,
      generateInvoiceFromReconciliation,
    }),
    [
      pharmacies,
      users,
      products,
      invoices,
      payments,
      feeTiers,
      csvJobs,
      orders,
      comments,
      portalView,
      portalPharmacyId,
      portalTab,
      setPortalView,
      setPortalPharmacyId,
      setPortalTab,
      addPharmacy,
      updatePharmacy,
      togglePharmacyStatus,
      deletePharmacy,
      addUser,
      updateUser,
      toggleUserStatus,
      deleteUser,
      addProduct,
      updateProduct,
      adjustStock,
      toggleMarkupVisible,
      deleteProduct,
      createInvoice,
      recordPayment,
      getPaymentsForInvoice,
      getPaidAmountForInvoice,
      getComments,
      addComment,
      addFeeTier,
      updateFeeTier,
      deleteFeeTier,
      checkDuplicateJob,
      commitInventoryCsv,
      commitOrdersCsv,
      computeReconciliation,
      generateInvoiceFromReconciliation,
    ]
  );

  return (
    <PartnersContext.Provider value={value}>
      {children}
    </PartnersContext.Provider>
  );
}

export function usePartners() {
  const context = useContext(PartnersContext);
  if (!context) {
    return {
      pharmacies: INITIAL_PHARMACIES,
      users: INITIAL_USERS,
      products: INITIAL_PRODUCTS,
      invoices: INITIAL_INVOICES,
      payments: INITIAL_PAYMENTS,
      feeTiers: INITIAL_FEE_TIERS,
      csvJobs: INITIAL_CSV_JOBS,
      orders: [] as OrderRecord[],
      comments: INITIAL_COMMENTS,
      portalView: "admin" as const,
      portalPharmacyId: "ph1",
      portalTab: "dashboard" as const,
      setPortalView: () => {},
      setPortalPharmacyId: () => {},
      setPortalTab: () => {},
      addPharmacy: () => "",
      updatePharmacy: () => {},
      togglePharmacyStatus: () => {},
      deletePharmacy: () => {},
      addUser: () => {},
      updateUser: () => {},
      toggleUserStatus: () => {},
      deleteUser: () => {},
      addProduct: () => {},
      updateProduct: () => {},
      adjustStock: () => {},
      toggleMarkupVisible: () => {},
      deleteProduct: () => {},
      createInvoice: () => {},
      recordPayment: () => {},
      getPaymentsForInvoice: () => [],
      getPaidAmountForInvoice: () => 0,
      getComments: () => [],
      addComment: () => {},
      addFeeTier: () => {},
      updateFeeTier: () => {},
      deleteFeeTier: () => {},
      checkDuplicateJob: () => undefined,
      commitInventoryCsv: () => {},
      commitOrdersCsv: () => {},
      computeReconciliation: () => ({
        ph: INITIAL_PHARMACIES[0],
        csvTotal: 0,
        paidAdyen: 0,
        paidBank: 0,
        outstanding: 0,
        totalMarkup: 0,
        platformFees: 0,
        finalAmount: 0,
        usingRealOrders: false,
      }),
      generateInvoiceFromReconciliation: () => "",
    };
  }
  return context;
}
