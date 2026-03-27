"use client";

import React from "react";
import Select, { SingleValue, StylesConfig } from "react-select";
import { Label } from "./label";
import { IDropdownItem } from "@/types/dropdownTypes";


interface ReactSelectDropdownProps {
  items: IDropdownItem[];
  widthClass?: string; // Tailwind width e.g. "w-[180px]"
  height?: number; // height of control
  label?: string; // optional label
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  isSearchable?: boolean; // enable/disable search
  isClearable?: boolean; // enable/disable clear button
}

export default function ReactSelectDropdown({
  items,
  widthClass = "w-full",
  height = 45,
  label,
  placeholder = "Select a value",
  value,
  onChange,
  error,
  isSearchable = true,
  isClearable = true,
}: ReactSelectDropdownProps) {
  // react-select expects {value,label} objects
  const options = items.map((i) => ({
    value: i.value,
    label: i.label,
  }));

  const selectedOption = options.find((opt) => opt.value === value) || null;

  // style overrides so it looks like your DropdownMenu
  const styles: StylesConfig<
    { value: string; label: string | React.ReactElement },
    false
  > = {
    control: (base, state) => ({
      ...base,
      minHeight: `${height}px`,
      height: `${height}px`,
      borderColor: state.isFocused ? "var(--secondary-2)" : "var(--input)",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 1px var(--secondary-2)" : "",
      "&:hover": {
        borderColor: "var(--secondary-2)",
      },
      fontSize: "15px",
      color: "var(--secondary)",
    }),
    valueContainer: (base) => ({
      ...base,
      paddingLeft: "1rem",
      paddingRight: "1rem",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      paddingRight: "0.5rem",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000,
      borderRadius: "0.375rem",
      border: "1px solid var(--input)",
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      paddingTop: "0.75rem",
      paddingBottom: "0.75rem",
      backgroundColor: state.isSelected
        ? "var(--secondary-2)"
        : state.isFocused
        ? "var(--accent)"
        : undefined,
      color: state.isSelected
        ? "white"
        : state.isFocused
        ? "var(--accent-foreground)"
        : undefined,
      fontWeight: state.isSelected ? 600 : 400,
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--muted-foreground)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--secondary)",
    }),
  };

  return (
    <div className={widthClass}>
      {label && (
        <Label className="mb-1 capitalize text-lg font-normal text-primary">
          {label}
        </Label>
      )}

      <Select
        options={options}
        value={selectedOption}
        onChange={(newValue: SingleValue<IDropdownItem>) =>
          onChange?.(newValue?.value || "")
        }
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        classNamePrefix="custom-select"
        styles={styles}
      />

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
