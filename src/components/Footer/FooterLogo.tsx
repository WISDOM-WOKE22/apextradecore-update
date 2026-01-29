"use client";

import Link from "next/link";

const TAGLINE = "Get a clear path to your financial goals";

export function FooterLogo() {
  return (
    <div className="flex max-w-[280px] flex-col gap-3">
      <Link
        href="/"
        className="flex items-center gap-2 no-underline"
        aria-label="ApexTradeCore  Investment - Home"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#cc0000] text-xl font-bold text-white"
          aria-hidden
        >
          T
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-white">
            TESLA
          </span>
          <span className="text-sm font-normal text-[#a0aec0]">
            Share Hub Investment
          </span>
        </div>
      </Link>
      <p className="text-sm leading-relaxed text-[#a0aec0]">{TAGLINE}</p>
    </div>
  );
}
