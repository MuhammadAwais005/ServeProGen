import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { E2E_PRIVATE_DIR } from "../../playwright.config";

/**
 * Creates a throwaway private folder for the PHP endpoint: dry-run mode, no
 * real credentials, PHPMailer not needed. Rate-limit data is reset each run.
 */
export default function globalSetup() {
  rmSync(E2E_PRIVATE_DIR, { recursive: true, force: true });
  mkdirSync(join(E2E_PRIVATE_DIR, "storage"), { recursive: true });
  writeFileSync(
    join(E2E_PRIVATE_DIR, "mail-config.php"),
    `<?php return [
  'mode' => 'dry_run',
  'allowed_origins' => ['http://localhost:4173'],
  'rate_limit_per_hour' => 50,
  'hash_salt' => 'e2e',
];\n`,
  );
}
