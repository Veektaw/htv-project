"use client";

import { useState, useMemo } from "react";
import { Pharmacy, Product } from "@/types/partners";
import { usePartners, CATEGORIES } from "../../contexts/partners-context";
import { Button } from "@/app/_components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import AddProductModal from "../modals/add-product-modal";
import AdjustStockModal from "../modals/adjust-stock-modal";
import InventoryCsvModal from "../modals/inventory-csv-modal";
import ConfirmCautionModal from "../../shared/confirm-caution-modal";

const formatMoney = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "—";
  return "€" + (v % 1 === 0 ? v.toLocaleString() : v.toFixed(2));
};

export default function ProductsTab({
  pharmacy,
  portalMode,
}: {
  pharmacy: Pharmacy;
  portalMode?: boolean;
}) {
  const { products, deleteProduct, toggleMarkupVisible } = usePartners();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [deleteTargetProduct, setDeleteTargetProduct] = useState<Product | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const pharmacyProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.pharmacyId === pharmacy.id &&
        (categoryFilter === "all" || p.category === categoryFilter)
    );
  }, [products, pharmacy.id, categoryFilter]);

  return (
    <div className="space-y-3.5">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-RangoonGreen text-lg font-extrabold tracking-tight">
          Products / Inventory
        </h2>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-border-strong rounded-full border bg-white px-4 py-2 text-xs font-bold text-RangoonGreen outline-none cursor-pointer"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCsvModalOpen(true)}
            className="border-border-strong rounded-full px-4 py-2 text-xs font-bold text-RangoonGreen hover:bg-gray-50 cursor-pointer"
          >
            ↑ Import Inventory CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="bg-RangoonGreen hover:bg-black rounded-full px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer"
          >
            + Add Product / Program
          </Button>
        </div>
      </div>

      {portalMode && (
        <div className="bg-[#fde7e2] text-[#c8432c] rounded-xl px-4 py-2.5 text-xs font-semibold">
          ⓘ Whether pharmacy users can edit pricing directly (vs. admin-exclusive) is an open question — see open-questions doc. Editing is enabled here for demo purposes.
        </div>
      )}

      {/* Direct Products Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-[13px] border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-[#eef0f7] text-[#5d6274] text-xs font-bold">
              <th className="px-3.5 py-3 font-bold">Name</th>
              <th className="px-3.5 py-3 font-bold">Type</th>
              <th className="px-3.5 py-3 font-bold">Category</th>
              <th className="px-3.5 py-3 font-bold">Date Created</th>
              <th className="px-3.5 py-3 font-bold">Qty</th>
              <th className="px-3.5 py-3 font-bold">Unit</th>
              <th className="px-3.5 py-3 font-bold">Price/Unit</th>
              <th className="px-3.5 py-3 font-bold">Aggregate Price</th>
              <th className="px-3.5 py-3 font-bold">Batch ID</th>
              <th className="px-3.5 py-3 font-bold">Manufacturer</th>
              <th className="px-3.5 py-3 font-bold">Pharmaceutical</th>
              <th className="px-3.5 py-3 font-bold">HTV Markup</th>
              <th className="px-1 py-3 text-right w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e9f3]">
            {pharmacyProducts.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-MistBlue py-12 text-center text-xs">
                  No products in this category.
                </td>
              </tr>
            ) : (
              pharmacyProducts.map((p) => {
                const canSeeMarkup = !portalMode || p.markupVisible;

                return (
                  <tr key={p.id} className="hover:bg-[#fafbff] transition-colors">
                    <td className="px-3.5 py-3.5 font-bold text-RangoonGreen">
                      <div>{p.name}</div>
                      {p.productType === "program" && p.components && (
                        <div className="text-MistBlue text-xs font-normal mt-0.5">
                          {p.components.length} component(s)
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.productType === "program"
                            ? "bg-[#e6f0fa] text-[#2a6fc9]"
                            : "bg-[#f0f2f7] text-[#5d6274]"
                        }`}
                      >
                        {p.productType === "program" ? "Program" : "Single"}
                      </span>
                    </td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen font-medium">{p.category}</td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen whitespace-nowrap">{p.dateCreated}</td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen font-semibold">
                      {p.qty.toLocaleString()}
                    </td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen">{p.unit}</td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen font-semibold">
                      {formatMoney(p.pricePerUnit)}
                    </td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen font-semibold whitespace-nowrap">
                      <div>{formatMoney(p.aggregatePrice)}</div>
                      <div className="mt-0.5">
                        <span className="bg-[#fdf3d8] text-[#a9790a] rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide">
                          ×qty
                        </span>
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5 font-mono text-RangoonGreen whitespace-nowrap">
                      {p.batchId}
                    </td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen font-semibold">
                      {formatMoney(p.manufacturerPrice)}
                    </td>
                    <td className="px-3.5 py-3.5 text-RangoonGreen font-semibold">
                      {formatMoney(p.pharmaceuticalPrice)}
                    </td>
                    <td className="px-3.5 py-3.5 whitespace-nowrap">
                      {canSeeMarkup ? (
                        <div>
                          <div className="text-xs">
                            <span className="font-bold text-RangoonGreen">
                              {formatMoney(p.htvMarkup)}
                            </span>{" "}
                            <span className="text-[#8c91a4] font-normal text-xs">
                              (HTV price {formatMoney(p.htvPrice)})
                            </span>
                          </div>
                          {!portalMode && (
                            <div className="mt-1">
                              <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                  type="checkbox"
                                  checked={p.markupVisible}
                                  onChange={() => toggleMarkupVisible(p.id)}
                                  className="peer sr-only"
                                />
                                <div className="peer h-4 w-7 rounded-full bg-gray-300 peer-checked:bg-PortlandOrange after:absolute after:top-[2px] after:left-[2px] after:size-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-3"></div>
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-MistBlue text-xs flex items-center gap-1 font-normal">
                          <span>🔒</span> Hidden by HTV admin
                        </span>
                      )}
                    </td>
                    <td className="px-1 py-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full text-MistBlue hover:bg-gray-100 hover:text-RangoonGreen cursor-pointer"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-lg border-border">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="cursor-pointer text-xs font-semibold py-2"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setAdjustingProduct(p)}
                            className="cursor-pointer text-xs font-semibold py-2"
                          >
                            Adjust Stock
                          </DropdownMenuItem>
                          {!portalMode && (
                            <DropdownMenuItem
                              onClick={() => setDeleteTargetProduct(p)}
                              className="text-ChiliPepper cursor-pointer text-xs font-semibold py-2 hover:bg-red-50"
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        pharmacyId={pharmacy.id}
        editingProduct={editingProduct}
      />

      <AdjustStockModal
        isOpen={Boolean(adjustingProduct)}
        onClose={() => setAdjustingProduct(null)}
        product={adjustingProduct}
      />

      <InventoryCsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        pharmacy={pharmacy}
      />

      {deleteTargetProduct && (
        <ConfirmCautionModal
          isOpen={Boolean(deleteTargetProduct)}
          onClose={() => setDeleteTargetProduct(null)}
          onConfirm={() => deleteProduct(deleteTargetProduct.id)}
          title={`Are you sure you want to delete ${deleteTargetProduct.name}?`}
          description="This action will permanently delete this product from the pharmacy catalog. Any active invoices referencing this item will maintain historical data."
          confirmLabel="Delete Product"
          variant="danger"
        />
      )}
    </div>
  );
}
