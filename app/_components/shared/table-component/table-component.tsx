import { ReactNode } from "react";
import { cn, generateRandomId } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export interface Column<T> {
  title: string;
  renderTitle?: () => ReactNode;
  key: keyof T | string;
  render?: (value: T[keyof T], record: T) => ReactNode;
  mobileViewRender?: (value: T[keyof T], record: T) => ReactNode;
}

export interface TableComponentProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TableComponent<T extends Record<string, any>>(
  props: TableComponentProps<T>,
) {
  const { title, columns, data, className } = props;

  return (
    <>
      <Table
        className={cn(
          "min-w-200 text-sm font-medium group-has-data-[datefilterpending=true]:animate-pulse group-has-data-[paginationpending=true]:animate-pulse group-has-data-[platformfilterpending=true]:animate-pulse group-has-data-[rolefilterpending=true]:animate-pulse group-has-data-[searchpending=true]:animate-pulse group-has-data-[statusfilterpending=true]:animate-pulse",
          className,
        )}
      >
        <TableCaption className="sr-only">{title}</TableCaption>

        <TableHeader className="bg-SoftPeach">
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className="px-8 py-4 text-center text-black"
              >
                {column.renderTitle ? column.renderTitle() : column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id || generateRandomId()}>
              {columns.map((column) => (
                <TableCell
                  key={`${rowIndex}-${column.key.toString()}`}
                  className="border-GreyCloud text-MistBlue border-b px-8 py-6"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : (row[column.key] as ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MobileCards {...props} />
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MobileCards<T extends Record<string, any>>({
  columns,
  data,
}: TableComponentProps<T>) {
  const statusColumn = columns.find((column) => column.key === "status");
  const actionsColumn = columns.find((column) => column.key === "actions");

  const renderCell = (column: Column<T>, row: T) => {
    if (column.mobileViewRender)
      return column.mobileViewRender(row[column.key], row);
    if (column.render) return column.render(row[column.key], row);
    return row[column.key] as ReactNode;
  };

  return (
    <div className="min-[475px]:hidden">
      {columns.slice(0, 1).map((column, index) => (
        <header
          key={index}
          className="bg-DesertStorm-100 p-3 text-xs font-medium"
        >
          {column.renderTitle ? column.renderTitle() : column.title}
        </header>
      ))}

      <div>
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="border-Seashell-200 flex justify-between gap-2.5 border-b px-1 py-3.5"
          >
            <div className="flex flex-1 justify-between gap-2">
              {renderCell(columns[0], row)}

              {statusColumn && (
                <div className="flex items-center gap-1.5 self-end">
                  <span className="bg-LightGrey inline-block size-1.5 rounded-full"></span>
                  {renderCell(statusColumn, row)}
                </div>
              )}
            </div>

            {actionsColumn && renderCell(actionsColumn, row)}
          </div>
        ))}
      </div>
    </div>
  );
}
