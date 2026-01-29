"use client";

import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ResetPasswordSection } from "@/components/ResetPassword";
import { Footer } from "@/components/Footer";

function ResetPasswordContent() {
  return <ResetPasswordSection />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Header />
      <main>
        <Suspense fallback={<div className="flex min-h-[calc(100vh-144px)] items-center justify-center">Loading...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
