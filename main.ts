import requestHandler from "./api/index.ts";

Deno.serve({ port: Number(Deno.env.get("PORT")) || 8080 }, requestHandler);
