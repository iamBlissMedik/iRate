"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Search } from "lucide-react";

import { Label } from "./label";
import { Input } from "./input"; // shadcn input
import { IDropdownItem } from "@/types/dropdownTypes";

interface CustomDropdownMenuProps {
  items: IDropdownItem[];
  widthClass?: string;
  placeholder?: string;
  placeholderIcon?: React.ReactNode;
  height?: number;
  inputWidth?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  search?: boolean; // 👈 new prop to toggle search
}

const CustomDropdownMenu = ({
  items,
  widthClass,
  placeholder,
  placeholderIcon,
  height = 45,
  inputWidth = "w-[180px]",
  label,
  value,
  onChange,
  error,
  search = false, // default false
}: CustomDropdownMenuProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selected = items.find((item) => item.value === value) || null;

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [inputWidth]);

  // Filter items by search term only if search enabled
  const filteredItems = search
    ? items.filter((item) =>
        typeof item.label === "string"
          ? item.label.toLowerCase().includes(searchTerm.toLowerCase())
          : false
      )
    : items;

  return (
    <div className={inputWidth}>
      {label && (
        <Label className="mb-1 capitalize text-lg font-normal text-primary">
          {label}
        </Label>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          ref={triggerRef}
          className={`flex justify-center gap-2 border border-input rounded-md text-secondary text-[15px] ${inputWidth} hover:bg-accent hover:text-accent-foreground cursor-pointer disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:border-secondary-2`}
          style={{ height: `${height}px` }}
        >
          <span className="flex justify-between px-4 items-center space-x-2 w-full">
            {placeholderIcon && (
              <div className="mr-2 mb-0.5">{placeholderIcon}</div>
            )}
            <div className="text-sm">
              {selected
                ? selected.label
                : placeholder
                ? placeholder
                : "Select a value"}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className={`space-y-2 z-[10000] ${widthClass ?? ""}`}
          style={
            widthClass
              ? undefined
              : triggerWidth
              ? { width: `${triggerWidth}px` }
              : undefined
          }
        >
          {/* Show search input only if search prop is true */}
          {search && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>
            </div>
          )}

          {/* Items */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  onChange?.(item.value);
                  if (search) setSearchTerm("");
                }}
                className={`cursor-pointer py-3 ${
                  value === item.value
                    ? "bg-secondary-2 text-white font-semibold data-[highlighted]:bg-secondary-2 data-[highlighted]:text-white"
                    : "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground font-normal"
                }`}
              >
                {item.label}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-2 px-4 text-sm text-muted-foreground">
              No results
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default CustomDropdownMenu;
