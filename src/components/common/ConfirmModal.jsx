"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  X,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/helpers";

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  tone = "danger", // "danger" | "primary"
}) {
  useEffect(() => {
    if (!open) return;

    const handler = (event) => {
      if (event.key === "Escape" && !loading) {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [open, loading, onCancel]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (typeof window === "undefined") return null;

  const isDanger = tone === "danger";

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-[#171717]/55 backdrop-blur-[3px]"
            onClick={() => {
              if (!loading) onCancel?.();
            }}
          />

          {/* Dialog */}
          <motion.div
            key="confirm-dialog"
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 12,
              scale: 0.98,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-x-4 top-1/2 z-[9999] -translate-y-1/2 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[440px] sm:-translate-x-1/2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby={
              description ? "confirm-modal-description" : undefined
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative overflow-hidden border border-[#d9d5cf] bg-[#f6f5f2] shadow-[0_30px_80px_-28px_rgba(23,23,23,0.55)]">
              {/* Top editorial line */}
              <div className="absolute left-0 right-0 top-0 h-px bg-[#866b42]" />

              {/* Close */}
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                aria-label="Close dialog"
                className={cn(
                  "absolute right-4 top-4 z-10",
                  "flex h-9 w-9 items-center justify-center",
                  "border border-[#d9d5cf] bg-white",
                  "text-[#77716a]",
                  "transition-all duration-200",
                  "hover:border-[#b9b4ad] hover:bg-[#ebe9e5] hover:text-[#171717]",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <X
                  className="h-4 w-4"
                  strokeWidth={1.4}
                />
              </button>

              <div className="px-6 pb-7 pt-9 sm:px-8 sm:pb-8 sm:pt-10">
                {/* Icon */}
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.88,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.05,
                    duration: 0.3,
                  }}
                  className={cn(
                    "mx-auto mb-6 flex h-16 w-16 items-center justify-center",
                    "border bg-white",
                    isDanger
                      ? "border-[#e0c8c4]"
                      : "border-[#d9d5cf]"
                  )}
                >
                  {isDanger ? (
                    <AlertTriangle
                      className="h-7 w-7 text-[#8d4b45]"
                      strokeWidth={1.25}
                    />
                  ) : (
                    <ShieldAlert
                      className="h-7 w-7 text-[#866b42]"
                      strokeWidth={1.25}
                    />
                  )}
                </motion.div>

                {/* Eyebrow */}
                <p
                  className={cn(
                    "text-center text-[9px] font-medium uppercase tracking-[0.3em]",
                    isDanger
                      ? "text-[#8d4b45]"
                      : "text-[#866b42]"
                  )}
                >
                  {isDanger ? "Please confirm" : "Confirmation"}
                </p>

                {/* Title */}
                <h2
                  id="confirm-modal-title"
                  className="mt-3 text-center font-serif text-3xl leading-tight tracking-[-0.025em] text-[#171717] sm:text-[2rem]"
                >
                  {title}
                </h2>

                {/* Editorial divider */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="h-px w-9 bg-[#b9b4ad]" />

                  <div
                    className={cn(
                      "h-1.5 w-1.5 rotate-45",
                      isDanger
                        ? "bg-[#8d4b45]"
                        : "bg-[#866b42]"
                    )}
                  />

                  <div className="h-px w-9 bg-[#b9b4ad]" />
                </div>

                {/* Description */}
                {description && (
                  <p
                    id="confirm-modal-description"
                    className="mx-auto mt-6 max-w-[340px] text-center text-sm leading-6 text-[#66615b]"
                  >
                    {description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className={cn(
                      "inline-flex h-12 flex-1 items-center justify-center",
                      "border border-[#d9d5cf] bg-white px-5",
                      "text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b]",
                      "transition-all duration-300",
                      "hover:border-[#b9b4ad] hover:bg-[#ebe9e5] hover:text-[#171717]",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  >
                    {cancelLabel}
                  </button>

                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                      "group inline-flex h-12 flex-1 items-center justify-center gap-2",
                      "px-5",
                      "text-[10px] font-medium uppercase tracking-[0.16em] text-white",
                      "transition-colors duration-300",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      isDanger
                        ? "bg-[#8d4b45] hover:bg-[#713b36]"
                        : "bg-[#181716] hover:bg-[#302d29]"
                    )}
                  >
                    {loading ? (
                      <>
                        <span
                          className={cn(
                            "h-3.5 w-3.5 animate-spin rounded-full border-2",
                            "border-white/30 border-t-white"
                          )}
                        />
                        Processing
                      </>
                    ) : (
                      <>
                        {confirmLabel}

                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                          strokeWidth={1.4}
                        />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}