import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// This will be initialized per request to ensure the correct context
export function getDb(env: any) {
  const dbBinding = env?.DB;
  
  if (!dbBinding) {
    throw new Error(
      "Cloudflare D1 'DB' binding not found. " +
      "If you are developing locally, please ensure you are running 'npm run dev' " +
      "(which now uses wrangler to bridge the database)."
    );
  }

  return drizzle(dbBinding, { schema });
}
