"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
interface CustomNavigationProps {
  href: string;
  text: string;
}
const CustomNavigation = ({ href, text }: CustomNavigationProps) => {
  return (
    <Button className="bg-transparent hover:bg-secondary-2 hover:text-white text-sm text-secondary-2 border border-secondary-2 font-normal capitalize">
      <Link href={href} className="inline-flex items-center ">
        <ChevronLeft className="mr-2 h-6 w-6 text-lg" />
        <span>{text}</span>
      </Link>
    </Button>
  );
};

export default CustomNavigation;
