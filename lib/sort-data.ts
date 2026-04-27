type SortDir = "asc" | "desc";

export function sortData<T extends Record<string, unknown>>(
  data: T[],
  sortKey?: string | null,
  sortDir?: string | null,
): T[] {
  if (!sortKey || !sortDir) return data;

  const direction = sortDir as SortDir;

  return [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();

    return direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}