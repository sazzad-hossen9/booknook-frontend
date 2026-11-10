"use client";

import { Search, LayoutGrid, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const CATEGORIES = [
  "All",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

/**
 * Frontend Search, Category Filter, and Sort By controls for the All Books page.
 * All filtering and sorting logic executes purely in the browser.
 */
export function BookFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: BookFilterProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col sm:flex-row items-center gap-3 rounded-[20px] border border-border bg-card p-2 sm:p-3 shadow-md backdrop-blur-md">
      {/* Search Input - Title search handled on the frontend */}
      <div className="relative flex flex-1 items-center w-full">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search books by title..."
          className="h-[46px] w-full rounded-xl bg-transparent pl-12 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#E0A526]/40"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 text-xs text-muted-foreground hover:text-foreground px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      <div className="hidden sm:block h-8 w-px bg-border" />

      {/* Category Dropdown */}
      <div className="w-full sm:w-48">
        <Select
          value={category}
          onValueChange={(val) => onCategoryChange(val || "All")}
        >
          <SelectTrigger className="h-[46px] w-full rounded-xl border-border bg-[#FAF7F2] dark:bg-[#111624] px-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-[#E0A526]" />
              <SelectValue placeholder="All Categories" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-card shadow-lg">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="cursor-pointer">
                {cat === "All" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By Dropdown */}
      <div className="w-full sm:w-44">
        <Select
          value={sort}
          onValueChange={(val) => onSortChange(val || "newest")}
        >
          <SelectTrigger className="h-[46px] w-full rounded-xl border-border bg-[#FAF7F2] dark:bg-[#111624] px-4 text-sm font-medium">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#2F7D6D]" />
              <SelectValue placeholder="Sort By" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border bg-card shadow-lg">
            <SelectItem value="newest" className="cursor-pointer">
              Newest
            </SelectItem>
            <SelectItem value="oldest" className="cursor-pointer">
              Oldest
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
