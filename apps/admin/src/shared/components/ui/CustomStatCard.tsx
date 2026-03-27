"use client";

import { memo } from "react";
import Image, { StaticImageData } from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface CustomStatCardProps {
  title: string;
  icon?: StaticImageData;
  value: string | number;
  description: string;
  valueColor?: string;
}
function CustomStatCard({
  title,
  icon,
  value,
  description,
  valueColor = "#CA0956",
}: CustomStatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-primary">
          <div className="font-semibold">{title}</div>
          {icon && (
            <div className="relative w-6 h-6">
              <Image
                src={icon}
                alt={`${title} icon`}
                fill
                className="object-contain"
              />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-[40px]" style={{ color: valueColor }}>
          {value}
        </div>
        <div className="text-secondary font-normal text-base">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(CustomStatCard);
