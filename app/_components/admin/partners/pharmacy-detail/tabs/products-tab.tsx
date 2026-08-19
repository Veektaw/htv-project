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
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(
    null,
  );
  const [deleteTargetProduct, setDeleteTargetProduct] =
    useState<Product | null>(null);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const pharmacyProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.pharmacyId === pharmacy.id &&
        (categoryFilter === "all" || p.category === categoryFilter),
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
            className="border-border-strong text-RangoonGreen cursor-pointer rounded-full border bg-white px-4 py-2 text-xs font-bold outline-none"
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
            className="border-border-strong text-RangoonGreen cursor-pointer rounded-full px-4 py-2 text-xs font-bold hover:bg-gray-50"
          >
            ↑ Import Inventory CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            className="bg-RangoonGreen cursor-pointer rounded-full px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-black"
          >
            + Add Product / Program
          </Button>
        </div>
      </div>

      {portalMode && (
        <div className="rounded-xl bg-[#fde7e2] px-4 py-2.5 text-xs font-semibold text-[#c8432c]">
          ⓘ Whether pharmacy users can edit pricing directly (vs.
          admin-exclusive) is an open question — see open-questions doc. Editing
          is enabled here for demo purposes.
        </div>
      )}

      {/* Direct Products Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px] whitespace-nowrap">
          <thead>
            <tr className="bg-[#eef0f7] text-xs font-bold text-[#5d6274]">
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
              <th className="w-8 px-1 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e9f3]">
            {pharmacyProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  className="text-MistBlue py-12 text-center text-xs"
                >
                  No products in this category.
                </td>
              </tr>
            ) : (
              pharmacyProducts.map((p) => {
                const canSeeMarkup = !portalMode || p.markupVisible;

                return (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-[#fafbff]"
                  >
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-bold">
                      <div>{p.name}</div>
                      {p.productType === "program" && p.components && (
                        <div className="text-MistBlue mt-0.5 text-xs font-normal">
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
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-medium">
                      {p.category}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 whitespace-nowrap">
                      {p.dateCreated}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-semibold">
                      {p.qty.toLocaleString()}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5">
                      {p.unit}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-semibold">
                      {formatMoney(p.pricePerUnit)}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-semibold whitespace-nowrap">
                      <div>{formatMoney(p.aggregatePrice)}</div>
                      <div className="mt-0.5">
                        <span className="rounded bg-[#fdf3d8] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-[#a9790a]">
                          ×qty
                        </span>
                      </div>
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-mono whitespace-nowrap">
                      {p.batchId}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-semibold">
                      {formatMoney(p.manufacturerPrice)}
                    </td>
                    <td className="text-RangoonGreen px-3.5 py-3.5 font-semibold">
                      {formatMoney(p.pharmaceuticalPrice)}
                    </td>
                    <td className="px-3.5 py-3.5 whitespace-nowrap">
                      {canSeeMarkup ? (
                        <div>
                          <div className="text-xs">
                            <span className="text-RangoonGreen font-bold">
                              {formatMoney(p.htvMarkup)}
                            </span>{" "}
                            <span className="text-xs font-normal text-[#8c91a4]">
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
                                <div className="peer peer-checked:bg-PortlandOrange h-4 w-7 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-0.5 after:size-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-3"></div>
                              </label>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-MistBlue flex items-center gap-1 text-xs font-normal">
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
                            className="text-MistBlue hover:text-RangoonGreen size-7 cursor-pointer rounded-full hover:bg-gray-100"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-border w-36 rounded-xl shadow-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProduct(p);
                              setIsProductModalOpen(true);
                            }}
                            className="cursor-pointer py-2 text-xs font-semibold"
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setAdjustingProduct(p)}
                            className="cursor-pointer py-2 text-xs font-semibold"
                          >
                            Adjust Stock
                          </DropdownMenuItem>
                          {!portalMode && (
                            <DropdownMenuItem
                              onClick={() => setDeleteTargetProduct(p)}
                              className="text-ChiliPepper cursor-pointer py-2 text-xs font-semibold hover:bg-red-50"
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
