"use client";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";

type CheckboxFieldProps<T extends FieldValues> = {
  id: Path<T>;
  label: string;
  control: Control<T>;
};

export default function CheckboxField<T extends FieldValues>({
  id,
  label,
  control,
}: CheckboxFieldProps<T>) {
  return (
    <div className="flex items-center space-x-2">
      <Controller
        name={id}
        control={control}
        render={({ field }) => (
          <>
            <Checkbox
              id={id}
              checked={!!field.value}
              // Shadcn Checkbox returns `boolean | "indeterminate"`
              onCheckedChange={(checked: boolean) =>
                field.onChange(checked === true)
              }
              className="cursor-pointer"
            />
            <Label htmlFor={id} className="cursor-pointer">
              {label}
            </Label>
          </>
        )}
      />
    </div>
  );
}
