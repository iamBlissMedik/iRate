"use client";

import React from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { GroupBase, StylesConfig } from "react-select";
import { Label } from "./label";

interface OptionType {
  value: string;
  label: string;
  email?: string;
}

interface CustomAsyncSelectDropdownProps {
  label?: string;
  placeholder?: string;
  value?: OptionType | null;
  onChange?: (value: OptionType | null) => void;
  error?: string;
  isClearable?: boolean;
  height?: number;
  // your fetcher: (searchTerm, loadedOptions, {page}) => Promise<{options, hasMore, additional}>
  loadOptions: LoadOptions<
    OptionType,
    GroupBase<OptionType>,
    {
      page: number;
    }
  >;
}

export default function CustomAsyncSelectDropdown({
  label,
  placeholder = "Select a value",
  value,
  onChange,
  error,
  isClearable = true,
  height = 45,
  loadOptions,
}: CustomAsyncSelectDropdownProps) {
  const styles: StylesConfig<OptionType, false> = {
    placeholder: (base) => ({
      ...base,
      fontSize: "14px",
    }),
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
      cursor: "pointer",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000,
      borderRadius: "0.375rem",
      border: "1px solid var(--input)",
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
  };

  return (
    <div>
      {label && (
        <Label className="mb-1 capitalize text-lg font-normal text-primary">
          {label}
        </Label>
      )}

      <AsyncPaginate
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        loadOptions={loadOptions}
        isClearable={isClearable}
        additional={{ page: 1 }} // start page
        styles={styles}
        debounceTimeout={300} // wait before firing API
        instanceId="company-search"
      />

      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
}
