export type FulfillmentType = "pickup" | "delivery";
export type PharmacyStatus = "active" | "inactive";
export type FeeType = "volume_based" | "flat";
export type CadenceType = "monthly" | "biweekly";

export type Pharmacy = {
  id: string;
  name: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  status: PharmacyStatus;
  fulfillment: FulfillmentType;
  feeType: FeeType;
  flatFeeAmount: number | null;
  cadence: CadenceType;
};

export type PharmacyUserRole = "Pharmacy Admin" | "Pharmacy Staff";
export type PharmacyUserStatus = "active" | "deactivated";

export type PharmacyUser = {
  id: string;
  pharmacyId: string;
  title: string;
  first: string;
  last: string;
  email: string;
  role: PharmacyUserRole;
  status: PharmacyUserStatus;
};

export type ProductType = "single" | "program";

export type ProgramComponent = {
  productId: string;
  qty: number;
};

export type StockLogEntry = {
  date: string;
  change: number;
  reason: string;
  by: string;
};

export type Product = {
  id: string;
  pharmacyId: string;
  category: string;
  productType: ProductType;
  name: string;
  dateCreated: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  aggregatePrice: number;
  pharmaId: string;
  batchId: string;
  barcode: string;
  manufacturerPrice: number;
  pharmaceuticalPrice: number;
  htvMarkup: number;
  htvPrice: number;
  markupVisible: boolean;
  unitsSold90d: number;
  stockLog: StockLogEntry[];
  components?: ProgramComponent[];
};

export type InvoiceDirection = "htv_to_pharmacy" | "pharmacy_to_htv";
export type PartnerInvoiceStatus = "paid" | "under_review" | "pending";

export type InvoiceLineItem = {
  desc: string;
  qty: number | null;
  unitPrice: number | null;
  amount: number;
  type: "product" | "platform_fee";
};

export type PartnerInvoice = {
  id: string;
  direction: InvoiceDirection;
  pharmacyId: string;
  number: string;
  month: string;
  amount: number;
  status: PartnerInvoiceStatus;
  dateCreated: string;
  lines: InvoiceLineItem[];
};

export type PaymentMethod = "adyen" | "bank_transfer";

export type PartnerPayment = {
  id: string;
  invoiceId: string;
  method: PaymentMethod;
  amount: number;
  paidAt: string;
  reference: string;
};

export type FeeTier = {
  id: string;
  min: number;
  max: number | null;
  rate: number;
};

export type CsvRowStatus = "ok" | "error";

export type InventoryCsvRowPreview = {
  row: number;
  name: string;
  qty: number | string;
  unit: string;
  batchId: string;
  status: CsvRowStatus;
  error?: string;
};

export type OrderCsvRowPreview = {
  row: number;
  orderId: string;
  product: string;
  qty: number;
  amount: number;
  dateFulfilled: string;
  status: CsvRowStatus;
  error?: string;
  rowType: "order" | "refund";
};

export type CsvJob = {
  id: string;
  pharmacyId: string;
  jobType: "inventory" | "orders_fulfilled";
  period: string;
  committedAt: string;
  rowCount: number;
};

export type OrderRecord = {
  id: string;
  pharmacyId: string;
  period: string;
  orderId: string;
  product: string;
  qty: number;
  amount: number;
  dateFulfilled: string;
  rowType: "order" | "refund";
};

export type PartnerComment = {
  id: string;
  entityType: "invoice" | "reconciliation";
  entityId: string;
  author: string;
  text: string;
  date: string;
};

export type ReconciliationSummary = {
  ph: Pharmacy;
  csvTotal: number;
  paidAdyen: number;
  paidBank: number;
  outstanding: number;
  totalMarkup: number;
  platformFees: number;
  finalAmount: number;
  usingRealOrders: boolean;
};
