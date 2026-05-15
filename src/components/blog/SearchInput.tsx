"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef, useCallback } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
}

export function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams();
        if (value.trim()) params.set("q", value.trim());
        // Reset to page 1 on new search
        router.push(`${pathname}?${params.toString()}`);
      }, 350);
    },
    [router, pathname]
  );

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Search stories..."
        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
      />
    </div>
  );
}
