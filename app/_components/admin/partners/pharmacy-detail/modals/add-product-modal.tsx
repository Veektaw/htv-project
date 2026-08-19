"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { usePartners, CATEGORIES } from "../../contexts/partners-context";
import { Product, ProductType, ProgramComponent } from "@/types/partners";
import { showErrorToast } from "@/lib/toast";
import { Trash2, Plus } from "lucide-react";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pharmacyId: string;
  editingProduct?: Product | null;
};

function ProductForm({
  pharmacyId,
  editingProduct,
  onClose,
}: {
  pharmacyId: string;
  editingProduct?: Product | null;
  onClose: () => void;
}) {
  const { addProduct, updateProduct, products } = usePartners();

  const [name, setName] = useState(editingProduct?.name || "");
  const [category, setCategory] = useState(
    editingProduct?.category || CATEGORIES[0],
  );
  const [productType, setProductType] = useState<ProductType>(
    editingProduct?.productType || "single",
  );
  const [qty, setQty] = useState<string>(
    editingProduct ? String(editingProduct.qty) : "",
  );
  const [unit, setUnit] = useState(editingProduct?.unit || "");
  const [pricePerUnit, setPricePerUnit] = useState<string>(
    editingProduct ? String(editingProduct.pricePerUnit) : "",
  );
  const [pharmaId, setPharmaId] = useState(editingProduct?.pharmaId || "");
  const [batchId, setBatchId] = useState(editingProduct?.batchId || "");
  const [barcode, setBarcode] = useState(editingProduct?.barcode || "");
  const [manufacturerPrice, setManufacturerPrice] = useState<string>(
    editingProduct ? String(editingProduct.manufacturerPrice) : "",
  );
  const [pharmaceuticalPrice, setPharmaceuticalPrice] = useState<string>(
    editingProduct ? String(editingProduct.pharmaceuticalPrice) : "",
  );
  const [htvMarkup, setHtvMarkup] = useState<string>(
    editingProduct ? String(editingProduct.htvMarkup) : "",
  );
  const [markupVisible, setMarkupVisible] = useState(
    editingProduct ? editingProduct.markupVisible : true,
  );
  const [components, setComponents] = useState<ProgramComponent[]>(
    editingProduct?.components ? [...editingProduct.components] : [],
  );

  const todayStr = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const dateCreatedDisplay = editingProduct
    ? editingProduct.dateCreated
    : `${todayStr} (today)`;

  const otherProducts = products.filter(
    (p) =>
      p.pharmacyId === pharmacyId &&
      p.productType !== "program" &&
      p.id !== editingProduct?.id,
  );

  const handleAddComponent = () => {
    if (otherProducts.length === 0) {
      showErrorToast(
        "No single products available to bundle into this program",
      );
      return;
    }
    setComponents((prev) => [
      ...prev,
      { productId: otherProducts[0].id, qty: 1 },
    ]);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const handleComponentChange = (
    index: number,
    field: "productId" | "qty",
    value: string | number,
  ) => {
    setComponents((prev) => {
      const copy = [...prev];
      if (field === "productId") copy[index].productId = String(value);
      if (field === "qty") copy[index].qty = Math.max(1, Number(value) || 1);
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showErrorToast("Product name is required");
      return;
    }
    if (productType === "program" && components.length === 0) {
      showErrorToast("Please add at least one component to the program bundle");
      return;
    }

    const numQty = Number(qty) || 0;
    const numPricePerUnit = Number(pricePerUnit) || 0;
    const numManuf = Number(manufacturerPrice) || 0;
    const numPharma = Number(pharmaceuticalPrice) || 0;
    const numMarkup = Number(htvMarkup) || 0;

    const payload = {
      pharmacyId,
      name: name.trim(),
      category,
      productType,
      qty: editingProduct ? editingProduct.qty : numQty,
      unit: unit.trim() || "unit",
      dateCreated: editingProduct ? editingProduct.dateCreated : todayStr,
      pricePerUnit: numPricePerUnit,
      aggregatePrice:
        (editingProduct ? editingProduct.qty : numQty) * numPricePerUnit,
      pharmaId: pharmaId.trim(),
      batchId: batchId.trim(),
      barcode: barcode.trim(),
      manufacturerPrice: numManuf,
      pharmaceuticalPrice: numPharma,
      htvMarkup: numMarkup,
      htvPrice: numPharma + numMarkup,
      markupVisible,
      unitsSold90d: editingProduct ? editingProduct.unitsSold90d : 0,
      stockLog: editingProduct
        ? editingProduct.stockLog
        : [
            {
              date: todayStr,
              change: numQty,
              reason: "Initial stock entry",
              by: "Admin",
            },
          ],
      components: productType === "program" ? components : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      {/* Exact 2-Column Form Grid */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        {/* Row 1 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Product Name*
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Paracetamol 500mg"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Category*
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Row 2 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Product Type*
          </label>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value as ProductType)}
            className="focus:border-PortlandOrange h-11 w-full cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none"
          >
            <option value="single">Single product</option>
            <option value="program">Program (bundle)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Quantity*
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
            disabled={Boolean(editingProduct)}
            title={
              editingProduct ? "Use Adjust Stock to change quantity" : undefined
            }
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9] disabled:bg-gray-50"
            required
          />
        </div>

        {/* Row 3 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Unit*
          </label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="tablet, bottle, box…"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Date Created
          </label>
          <div className="flex h-11 w-full items-center rounded-lg border border-[#d8dcee] bg-[#f9fafc] px-3.5 text-[13.5px] text-[#5d6274]">
            {dateCreatedDisplay}
          </div>
        </div>

        {/* Row 4 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Price per Unit*
          </label>
          <input
            type="number"
            step="0.01"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            placeholder="0.00"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] leading-tight font-bold text-[#5d6274]">
            Pharmaceutical ID{" "}
            <span className="text-[11px] font-normal text-[#8c91a4]">
              (per-product registration ID — not a pharmacy-level ID; confirm
              this is what&apos;s meant)
            </span>
          </label>
          <input
            type="text"
            value={pharmaId}
            onChange={(e) => setPharmaId(e.target.value)}
            placeholder="PH-XXXXX"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
          />
        </div>

        {/* Row 5 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Batch ID
          </label>
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="B-YYYY-NNNN"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Barcode ID
          </label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="EAN/GTIN"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
          />
        </div>

        {/* Row 6 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Manufacturer Price*
          </label>
          <input
            type="number"
            step="0.01"
            value={manufacturerPrice}
            onChange={(e) => setManufacturerPrice(e.target.value)}
            placeholder="0.00"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Pharmaceutical Price*
          </label>
          <input
            type="number"
            step="0.01"
            value={pharmaceuticalPrice}
            onChange={(e) => setPharmaceuticalPrice(e.target.value)}
            placeholder="0.00"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        {/* Row 7 */}
        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            HTV Markup*
          </label>
          <input
            type="number"
            step="0.01"
            value={htvMarkup}
            onChange={(e) => setHtvMarkup(e.target.value)}
            placeholder="0.00"
            className="focus:border-PortlandOrange h-11 w-full rounded-lg border border-[#d8dcee] bg-white px-3.5 text-[13.5px] text-[#15151a] outline-none placeholder:text-[#b3b8c9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[12.5px] font-bold text-[#5d6274]">
            Visible to Pharmacy
          </label>
          <div className="pt-2">
            <label className="relative inline-block h-5.5 w-9.5 cursor-pointer">
              <input
                type="checkbox"
                checked={markupVisible}
                onChange={(e) => setMarkupVisible(e.target.checked)}
                className="peer sr-only"
              />
              <span className="peer-checked:bg-PortlandOrange absolute inset-0 rounded-full bg-[#d8dcee] transition-colors before:absolute before:top-0.75 before:left-0.75 before:size-4 before:rounded-full before:bg-white before:transition-transform peer-checked:before:translate-x-4"></span>
            </label>
          </div>
        </div>

        {/* Program Components (if program) */}
        {productType === "program" && (
          <div className="col-span-1 space-y-3 rounded-xl border border-[#d8dcee] bg-[#f9fafc] p-4 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#15151a]">
                  Program Components
                </h4>
                <p className="text-[11px] text-[#8c91a4]">
                  Select which single products and quantities make up this
                  bundle
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddComponent}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#d8dcee] bg-white px-3 py-1.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
              >
                <Plus className="size-3.5" /> Add Component
              </button>
            </div>

            {components.length === 0 ? (
              <p className="py-3 text-center text-xs text-[#8c91a4]">
                No components yet — add at least one.
              </p>
            ) : (
              <div className="space-y-2">
                {components.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-[#d8dcee] bg-white p-2"
                  >
                    <select
                      value={comp.productId}
                      onChange={(e) =>
                        handleComponentChange(idx, "productId", e.target.value)
                      }
                      className="h-10 flex-1 cursor-pointer rounded-lg border border-[#d8dcee] bg-white px-3 text-xs text-[#15151a] outline-none"
                    >
                      {otherProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.unit})
                        </option>
                      ))}
                    </select>

                    <div className="w-24">
                      <input
                        type="number"
                        min="1"
                        value={comp.qty}
                        onChange={(e) =>
                          handleComponentChange(idx, "qty", e.target.value)
                        }
                        placeholder="Qty"
                        className="h-10 w-full rounded-lg border border-[#d8dcee] bg-white px-3 text-xs text-[#15151a] outline-none"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="text-ChiliPepper cursor-pointer rounded-lg p-2 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footnote */}
      <div className="pt-2 text-xs leading-relaxed text-[#8c91a4]">
        Aggregate price is computed automatically (price/unit × quantity —
        formula pending stakeholder confirmation, see open-questions doc). HTV
        Price is computed as Pharmaceutical Price + HTV Markup.
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full border border-[#d8dcee] bg-white px-5 py-2.5 text-xs font-bold text-[#15151a] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer rounded-full bg-[#15151a] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default function AddProductModal({
  isOpen,
  onClose,
  pharmacyId,
  editingProduct,
}: AddProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] w-full overflow-y-auto rounded-4xl border border-[#e7e9f3] bg-white p-8 shadow-2xl sm:max-w-160"
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-left text-xl font-extrabold text-[#15151a]">
            {editingProduct ? "Edit Product" : "New Product"}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <ProductForm
            key={editingProduct?.id || "new-product"}
            pharmacyId={pharmacyId}
            editingProduct={editingProduct}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
