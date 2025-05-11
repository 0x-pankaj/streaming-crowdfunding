"use client";

import { useEffect } from "react";
import * as StreamflowModule from "@streamflow/stream";

export function StreamflowDebug() {
  useEffect(() => {
    // Log all exports from the Streamflow module
    console.log("Streamflow module exports:", Object.keys(StreamflowModule));

    // Try to access specific exports
    console.log(
      "StreamflowSolana:",
      (StreamflowModule as any).StreamflowSolana
    );
    console.log(
      "createStreamClient:",
      (StreamflowModule as any).createStreamClient
    );

    // Check if there's a default export
    console.log("Default export:", (StreamflowModule as any).default);

    // Check for nested modules
    console.log("Solana module:", (StreamflowModule as any).solana);
  }, []);

  return <div>Check console for Streamflow module exports</div>;
}
