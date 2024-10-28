import React from "react";
import { LoadingSkeleton } from "@components/ui/LoadingSkeleton";

export default function loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <LoadingSkeleton />
      </div>
    </div>
  );
}
