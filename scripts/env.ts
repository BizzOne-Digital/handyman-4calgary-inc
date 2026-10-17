import { config } from "dotenv";

// Load .env.local first (local overrides), then .env.
config({ path: ".env.local" });
config({ path: ".env" });

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}
