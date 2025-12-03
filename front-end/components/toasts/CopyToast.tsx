"use client";

import React, { useEffect, useState } from "react";
import { CopySuccessful } from "../icons/CopySuccessful";

export type ToastItem = {
  id: number;
  message: string;
  duration: number; // ms
};

let lastToastCallback: ((toast: ToastItem) => void) | null = null;

export function pushCopyToast(message: string) {
  if (lastToastCallback) {
    lastToastCallback({
      id: Date.now(),
      message,
      duration: 7500, 
    });
  }
}

export function CopyToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    lastToastCallback = (toast) => {
      setToasts((prev) => [...prev, toast]);

      // auto remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration);
    };
  }, []);

  return (
    <div className="fixed top-[40px] right-[40px] z-[60] flex flex-col gap-3">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastCard({ toast }: { toast: ToastItem }) {
  // bar progress
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / toast.duration) * 100);
      setProgress(pct);

      if (pct < 100) requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <div
      className="
        w-[261px] bg-white rounded-[12px]
        shadow-md flex items-center gap-[12px]
        px-[16px] py-[10px]
      "
    >
      <CopySuccessful className="w-[28px] h-[28px]" />

      <div className="flex-1 flex flex-col">
        <span className="text-[16px] font-[500] text-[#5A5C5E]">
          {toast.message}
        </span>

        {/* PROGRESS BAR */}
        <div className="w-full h-[6px] bg-[#B0B0B0] rounded-[6px] mt-[6px] overflow-hidden">
          <div
            className="h-full bg-[#39A900] rounded-[6px] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
