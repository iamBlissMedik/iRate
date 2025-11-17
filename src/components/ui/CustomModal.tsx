"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "./dialog";
import { Separator } from "./separator";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  title?: string;
  description?: ReactNode;
  loading?: boolean;
  open: boolean;
  handleClose?: () => void;
  showConfirm?: boolean;
  showCancel?: boolean;
  showDivider?: boolean;
  confirmText?: string;
  handleConfirm?: () => void;
  cancelText?: string;
  minWidth?: number;
  maxWidth?: number;
  content?: ReactNode;
}
const CustomModal = ({
  open,
  title,
  description,
  loading,
  handleConfirm,
  confirmText = "Yes,I'm Sure",
  handleClose,
  cancelText = "Cancel",
  content,
  minWidth = 425,
  showDivider,
  showCancel,
  showConfirm,
  maxWidth,
}: CustomModalProps) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* overlay that covers the entire viewport */}
      <DialogOverlay className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* content on top */}
      <DialogContent
        className={cn(
          " z-[9999] px-14",
          "[&>button[data-slot='dialog-close']]:mr-10",
          "[&>button[data-slot='dialog-close']_svg]:size-8",
          "[&>button[data-slot='dialog-close']]:cursor-pointer",
          loading &&
            "[&>button[data-slot='dialog-close']]:pointer-events-none [&>button[data-slot='dialog-close']]:opacity-50",
          !handleClose && "[&>button]:hidden"
        )}
        style={{
          minWidth: `${minWidth}px`,
          maxWidth: `${maxWidth}px`,
        }}
      >
        <DialogHeader>
          <DialogTitle className=" mb-1 ">{title}</DialogTitle>
          <DialogDescription asChild>
            {description}
          </DialogDescription>
        </DialogHeader>
        {showDivider && <Separator />}
        <div>{content && content}</div>

        <DialogFooter>
          <div className="flex justify-center w-full gap-2">
            {showCancel && (
              <DialogClose asChild>
                <Button variant="outline" onClick={handleClose}>
                  {cancelText}
                </Button>
              </DialogClose>
            )}
            {showConfirm && (
              <Button
                className="bg-green-600 text-white hover:bg-green-700 hover:font-extrabold"
                disabled={loading}
                onClick={handleConfirm}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
