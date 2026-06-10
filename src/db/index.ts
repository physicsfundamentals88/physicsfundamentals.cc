import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// Get Cloudflare env bindings — works in both edge runtime and local dev
function getCloudflareEnv(): any {
  try {
    // @opennextjs/cloudflare exposes bindings via getRequestContext()
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequestContext } = require("@opennextjs/cloudflare");
    return getRequestContext().env;
  } catch {
    // Fallback for local development or if context is unavailable
    return (process as any).env;
  }
}

export function getDb(env?: any) {
  // Allow passing env directly for backward compat, or auto-detect
  const resolvedEnv = env?.DB ? env : getCloudflareEnv();
  const dbBinding = resolvedEnv?.DB;

  if (!dbBinding) {
    throw new Error(
      "Cloudflare D1 'DB' binding not found. " +
      "Make sure the D1 database is bound as 'DB' in your wrangler.toml."
    );
  }

  return drizzle(dbBinding, { schema });
}
