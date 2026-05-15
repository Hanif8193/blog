import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Explicitly mark as dynamic for App Router
export const dynamic = "force-dynamic";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // Add optional config if needed, but start minimal
});
