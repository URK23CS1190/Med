"use client";

import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Download } from "lucide-react";

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    searchable?: boolean;
    searchPlaceholder?: string;
    pageSize?: number;
    onExport?: () => void;
    emptyMessage?: string;
    filters?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
    columns, data, searchable = true, searchPlaceholder = "Search...",
    pageSize = 10, onExport, emptyMessage = "No data found", filters
}: DataTableProps<T>) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(0);

    const filtered = useMemo(() => {
        let result = data;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(row =>
                columns.some(col => {
                    const val = row[col.key];
                    return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
                })
            );
        }
        if (sortKey) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortKey] ?? "";
                const bVal = b[sortKey] ?? "";
                const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
                return sortDir === "asc" ? cmp : -cmp;
            });
        }
        return result;
    }, [data, search, sortKey, sortDir, columns]);

    const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    const handleSort = (key: string) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    return (
        <div className="card-base overflow-hidden">
            {(searchable || onExport || filters) && (
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-3">
                    {searchable && (
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary" />
                            <input
                                type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
                                placeholder={searchPlaceholder}
                                className="w-full h-9 pl-9 pr-4 rounded-lg bg-gray-50 dark:bg-surface-dark-elevated border-0 text-body-sm text-content-primary dark:text-content-dark-primary placeholder:text-content-tertiary focus:ring-2 focus:ring-primary-500/20"
                            />
                        </div>
                    )}
                    {filters}
                    {onExport && (
                        <button onClick={onExport} className="flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm font-medium text-content-secondary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    )}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                    className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary ${col.sortable ? "cursor-pointer hover:text-content-primary dark:hover:text-content-dark-primary select-none" : ""} ${col.className || ""}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && sortKey === col.key && (
                                            sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {paged.length === 0 ? (
                            <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-body-sm text-content-tertiary">{emptyMessage}</td></tr>
                        ) : paged.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                {columns.map(col => (
                                    <td key={col.key} className={`px-4 py-3 text-body-sm text-content-primary dark:text-content-dark-primary ${col.className || ""}`}>
                                        {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-body-sm text-content-secondary">
                    <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                            <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${page === i ? "bg-primary-500 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
