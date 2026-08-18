"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types/partners";
import { cn } from "@/lib/utils";

const formatMoney = (v: number | null | undefined): string => {
  if (v === null || v === undefined) return "—";
  return "€" + (v % 1 === 0 ? v.toLocaleString() : v.toFixed(2));
};

function median(arr: number[]): number {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export default function ScatterChart({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [hoveredProduct, setHoveredProduct] = useState<{
    product: Product;
    markupPct: number;
    x: number;
    y: number;
  } | null>(null);

  const { maxVol, maxMarkup, medVolPct, medMarkupPct, productStats } =
    useMemo(() => {
      const stats = products.map((p) => {
        const markup = p.htvPrice - p.pharmaceuticalPrice;
        const markupPct =
          p.pharmaceuticalPrice > 0
            ? (markup / p.pharmaceuticalPrice) * 100
            : 0;
        return {
          product: p,
          markup,
          markupPct,
          vol: p.unitsSold90d,
        };
      });

      const maxV = Math.max(...stats.map((s) => s.vol), 100) * 1.1;
      const maxM = Math.max(...stats.map((s) => s.markupPct), 10) * 1.15;

      const medV = median(stats.map((s) => s.vol));
      const medM = median(stats.map((s) => s.markupPct));

      return {
        maxVol: maxV,
        maxMarkup: maxM,
        medVolPct: (medV / maxV) * 100,
        medMarkupPct: (medM / maxM) * 100,
        productStats: stats,
      };
    }, [products]);

  const getQuadrant = (markupPct: number, vol: number) => {
    const medV = median(productStats.map((s) => s.vol));
    const medM = median(productStats.map((s) => s.markupPct));

    if (markupPct >= medM && vol >= medV) return "High markup · High volume";
    if (markupPct >= medM && vol < medV) return "High markup · Low volume";
    if (markupPct < medM && vol >= medV) return "Low markup · High volume";
    return "Low markup · Low volume";
  };

  return (
    <div className="border-border rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)] space-y-3.5">
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-[#8c91a4] text-xs font-semibold">
            Pharmacy · Reporting
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-RangoonGreen text-lg font-extrabold">
              Markup vs. Volume Sold
            </h3>
            <span className="bg-[#fdf3d8] text-[#a9790a] rounded px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide">
              NET-NEW WIDGET
            </span>
          </div>
        </div>

        <div className="bg-[#eef0f7] inline-flex rounded-full p-1">
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
              viewMode === "chart"
                ? "bg-white text-RangoonGreen shadow-xs"
                : "text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Chart
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
              viewMode === "table"
                ? "bg-white text-RangoonGreen shadow-xs"
                : "text-MistBlue hover:text-RangoonGreen"
            )}
          >
            Table
          </button>
        </div>
      </div>

      <p className="text-MistBlue text-xs">
        Which products carry high markup but low volume vs. high volume but low markup — helps prioritize what to push vs. what to re-price.
      </p>

      {viewMode === "chart" ? (
        <div className="space-y-2 pt-1">
          <div className="relative h-[340px] rounded-[10px] border border-[#e1e0d9] bg-[#fcfcfb] overflow-hidden select-none">
            {/* Median split dashed lines and quadrant labels */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute left-0 right-0 border-t border-dashed border-[#c3c2b7]"
                style={{ top: `${100 - medMarkupPct}%` }}
              />
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-[#c3c2b7]"
                style={{ left: `${medVolPct}%` }}
              />

              {/* Quadrant Labels */}
              <div className="absolute left-[10px] top-[10px] text-[10.5px] font-bold uppercase tracking-wider text-[#898781]">
                High markup · Low volume
              </div>
              <div className="absolute right-[10px] top-[10px] text-right text-[10.5px] font-bold uppercase tracking-wider text-[#898781]">
                High markup · High volume
              </div>
              <div className="absolute left-[10px] bottom-[24px] text-[10.5px] font-bold uppercase tracking-wider text-[#898781]">
                Low markup · Low volume
              </div>
              <div className="absolute right-[10px] bottom-[10px] text-right text-[10.5px] font-bold uppercase tracking-wider text-[#898781]">
                Low markup · High volume
              </div>
            </div>

            {/* Scatter Dots */}
            {productStats.map((stat) => {
              const x = (stat.vol / maxVol) * 100;
              const y = (stat.markupPct / maxMarkup) * 100;

              return (
                <div
                  key={stat.product.id}
                  onMouseEnter={() =>
                    setHoveredProduct({
                      product: stat.product,
                      markupPct: stat.markupPct,
                      x,
                      y,
                    })
                  }
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="absolute size-[14px] rounded-full bg-[#f15b41] border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] cursor-pointer hover:outline-2 hover:outline-[#c8432c] -translate-x-1/2 translate-y-1/2 transition-transform"
                  style={{ left: `${x.toFixed(1)}%`, bottom: `${y.toFixed(1)}%` }}
                />
              );
            })}

            {/* Axis Labels */}
            <div className="absolute left-[12px] bottom-[4px] text-[11px] font-bold text-[#898781] pointer-events-none">
              Volume sold (90d) →
            </div>
            <div
              className="absolute left-[-2px] top-[10px] text-[11px] font-bold text-[#898781] pointer-events-none"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Markup % →
            </div>

            {/* Hover Tooltip */}
            {hoveredProduct && (
              <div
                className="absolute z-20 bg-[#15151a] text-white text-[11.5px] font-semibold px-3 py-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl -translate-x-1/2 -translate-y-[120%]"
                style={{
                  left: `${hoveredProduct.x.toFixed(1)}%`,
                  bottom: `${hoveredProduct.y.toFixed(1)}%`,
                }}
              >
                <div className="font-bold">{hoveredProduct.product.name}</div>
                <div className="text-gray-300 font-normal text-[11px]">
                  Markup: {hoveredProduct.markupPct.toFixed(0)}% · Volume:{" "}
                  {hoveredProduct.product.unitsSold90d.toLocaleString()} units
                </div>
              </div>
            )}
          </div>

          <div className="text-[#8c91a4] text-xs mt-2.5 leading-relaxed">
            Dashed lines mark the median split. Hover a point for detail. Single-series scatter — no legend required per the dataviz standard; a table view is available via the toggle above for full accessibility.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full pt-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#eef0f7] text-[#5d6274] font-bold">
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Markup / unit</th>
                <th className="px-4 py-3 font-bold">Markup %</th>
                <th className="px-4 py-3 font-bold">Units sold (90d)</th>
                <th className="px-4 py-3 font-bold">Quadrant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e9f3]">
              {productStats.map((stat) => (
                <tr key={stat.product.id} className="hover:bg-[#fafbff] transition-colors">
                  <td className="px-4 py-3.5 font-bold text-RangoonGreen">
                    {stat.product.name}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-RangoonGreen">
                    {formatMoney(stat.markup)}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-RangoonGreen">
                    {stat.markupPct.toFixed(0)}%
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-RangoonGreen">
                    {stat.vol.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-[#f0f2f7] text-[#5d6274] inline-flex rounded-full px-3 py-1 font-semibold text-xs">
                      {getQuadrant(stat.markupPct, stat.vol)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
