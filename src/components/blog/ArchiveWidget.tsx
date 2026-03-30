"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Archive } from "@/lib/blog/types";

interface ArchiveWidgetProps {
    archive: Archive;
    locale: string;
}

export function ArchiveWidget({ archive, locale }: ArchiveWidgetProps) {
    const years = Object.keys(archive).sort((a, b) => Number(b) - Number(a));
    if (!years.length) return null;

    const currentMonthLabel = useMemo(
        () => new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date()),
        [locale],
    );
    const currentYear = new Date().getFullYear().toString();
    const initialOpenKey = `${currentYear}-${currentMonthLabel}`;
    const [openMonth, setOpenMonth] = useState<string | null>(initialOpenKey);
    const [openYear, setOpenYear] = useState<string | null>(currentYear);

    return (
        <aside className="rounded-2xl border border-border/70 bg-card/40 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {locale === "fr" ? "Archives" : "Archives"}
            </h3>

            <div className="mt-4 space-y-4 text-sm">
                {years.map((year) => (
                    <div key={year} className="space-y-1">
                        <button
                            type="button"
                            onClick={() => setOpenYear(openYear === year ? null : year)}
                            className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                        >
                            <span>{year}</span>
                            <span className="text-[10px] text-muted-foreground">{openYear === year ? "−" : "+"}</span>
                        </button>
                        {openYear === year && (
                            <ul className="space-y-1 border-l border-border/40 pl-3">
                                {Object.keys(archive[year]).map((month) => {
                                    const monthKey = `${year}-${month}`;
                                    const isOpen = openMonth === monthKey;
                                    return (
                                        <li key={month}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenMonth(isOpen ? null : monthKey)}
                                                className="flex w-full items-center justify-between text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
                                            >
                                                <span>{month}</span>
                                                <span className="text-[10px] text-muted-foreground">{isOpen ? "−" : "+"}</span>
                                            </button>
                                            {isOpen && (
                                                <ul className="mt-1 space-y-0.5">
                                                    {archive[year][month].map((post) => (
                                                        <li key={post.slug} className="truncate text-xs">
                                                            <Link
                                                                href={`/${locale}/blog/${post.slug}`}
                                                                className="text-muted-foreground hover:text-primary"
                                                            >
                                                                {post.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
}
