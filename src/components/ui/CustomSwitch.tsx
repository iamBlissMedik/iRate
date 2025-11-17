"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CustomSwitchProps extends React.ComponentProps<typeof Switch> {
  label: string;
  id: string;
}

const CustomSwitch = ({ label, id, ...props }: CustomSwitchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch id={id} {...props} />
      <Label htmlFor={id} className="text-primary cursor-pointer select-none text-base">
        {label}
      </Label>
    </div>
  );
};

export default CustomSwitch;
