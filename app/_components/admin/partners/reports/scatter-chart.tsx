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
    <div className="border-border space-y-3.5 rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(21,21,26,0.04),0_8px_24px_rgba(21,21,26,0.05)]">
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs font-semibold text-[#8c91a4]">
            Pharmacy · Reporting
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <h3 className="text-RangoonGreen text-lg font-extrabold">
              Markup vs. Volume Sold
            </h3>
            <span className="rounded bg-[#fdf3d8] px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-[#a9790a]">
              NET-NEW WIDGET
            </span>
          </div>
        </div>

        <div className="inline-flex rounded-full bg-[#eef0f7] p-1">
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              viewMode === "chart"
                ? "text-RangoonGreen bg-white shadow-xs"
                : "text-MistBlue hover:text-RangoonGreen",
            )}
          >
            Chart
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold transition-all",
              viewMode === "table"
                ? "text-RangoonGreen bg-white shadow-xs"
                : "text-MistBlue hover:text-RangoonGreen",
            )}
          >
            Table
          </button>
        </div>
      </div>

      <p className="text-MistBlue text-xs">
        Which products carry high markup but low volume vs. high volume but low
        markup — helps prioritize what to push vs. what to re-price.
      </p>

      {viewMode === "chart" ? (
        <div className="space-y-2 pt-1">
          <div className="relative h-85 overflow-hidden rounded-lg border border-[#e1e0d9] bg-[#fcfcfb] select-none">
            {/* Median split dashed lines and quadrant labels */}
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute right-0 left-0 border-t border-dashed border-[#c3c2b7]"
                style={{ top: `${100 - medMarkupPct}%` }}
              />
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-[#c3c2b7]"
                style={{ left: `${medVolPct}%` }}
              />

              {/* Quadrant Labels */}
              <div className="absolute top-2.5 left-2.5 text-[10.5px] font-bold tracking-wider text-[#898781] uppercase">
                High markup · Low volume
              </div>
              <div className="absolute top-2.5 right-2.5 text-right text-[10.5px] font-bold tracking-wider text-[#898781] uppercase">
                High markup · High volume
              </div>
              <div className="absolute bottom-6 left-2.5 text-[10.5px] font-bold tracking-wider text-[#898781] uppercase">
                Low markup · Low volume
              </div>
              <div className="absolute right-2.5 bottom-2.5 text-right text-[10.5px] font-bold tracking-wider text-[#898781] uppercase">
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
                  className="absolute size-3.5 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-[#f15b41] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] transition-transform hover:outline-2 hover:outline-[#c8432c]"
                  style={{
                    left: `${x.toFixed(1)}%`,
                    bottom: `${y.toFixed(1)}%`,
                  }}
                />
              );
            })}

            {/* Axis Labels */}
            <div className="pointer-events-none absolute bottom-1 left-3 text-[11px] font-bold text-[#898781]">
              Volume sold (90d) →
            </div>
            <div
              className="pointer-events-none absolute top-2.5 -left-0.5 text-[11px] font-bold text-[#898781]"
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
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[120%] rounded-lg bg-[#15151a] px-3 py-2 text-[11.5px] font-semibold whitespace-nowrap text-white shadow-xl"
                style={{
                  left: `${hoveredProduct.x.toFixed(1)}%`,
                  bottom: `${hoveredProduct.y.toFixed(1)}%`,
                }}
              >
                <div className="font-bold">{hoveredProduct.product.name}</div>
                <div className="text-[11px] font-normal text-gray-300">
                  Markup: {hoveredProduct.markupPct.toFixed(0)}% · Volume:{" "}
                  {hoveredProduct.product.unitsSold90d.toLocaleString()} units
                </div>
              </div>
            )}
          </div>

          <div className="mt-2.5 text-xs leading-relaxed text-[#8c91a4]">
            Dashed lines mark the median split. Hover a point for detail.
            Single-series scatter — no legend required per the dataviz standard;
            a table view is available via the toggle above for full
            accessibility.
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto pt-1">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#eef0f7] font-bold text-[#5d6274]">
                <th className="px-4 py-3 font-bold">Product</th>
                <th className="px-4 py-3 font-bold">Markup / unit</th>
                <th className="px-4 py-3 font-bold">Markup %</th>
                <th className="px-4 py-3 font-bold">Units sold (90d)</th>
                <th className="px-4 py-3 font-bold">Quadrant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7e9f3]">
              {productStats.map((stat) => (
                <tr
                  key={stat.product.id}
                  className="transition-colors hover:bg-[#fafbff]"
                >
                  <td className="text-RangoonGreen px-4 py-3.5 font-bold">
                    {stat.product.name}
                  </td>
                  <td className="text-RangoonGreen px-4 py-3.5 font-semibold">
                    {formatMoney(stat.markup)}
                  </td>
                  <td className="text-RangoonGreen px-4 py-3.5 font-bold">
                    {stat.markupPct.toFixed(0)}%
                  </td>
                  <td className="text-RangoonGreen px-4 py-3.5 font-semibold">
                    {stat.vol.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex rounded-full bg-[#f0f2f7] px-3 py-1 text-xs font-semibold text-[#5d6274]">
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
