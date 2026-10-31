import { z } from "zod";
import { contactServiceOptions } from "~/content/services";
import { budgetRanges } from "~/content/site";

/**
 * Contact form rules. The browser validates with this schema; the PHP endpoint
 * (public/api/contact.php) enforces the same limits independently.
 * Keep the two in sync when changing a rule.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  message: { min: 20, max: 5000 },
} as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, "Please enter your full name.")
    .max(CONTACT_LIMITS.name.max, "Please keep your name under 100 characters."),
  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.email.max, "That email address is too long.")
    .pipe(z.email("Enter a valid email address, like name@company.com.")),
  company: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.company.max, "Please keep the company name under 120 characters.")
    .optional()
    .or(z.literal("")),
  service: z.enum(contactServiceOptions, { error: "Choose the service you need." }),
  budget: z.enum(budgetRanges).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.message.min,
      "Please describe your project in at least 20 characters.",
    )
    .max(
      CONTACT_LIMITS.message.max,
      "Please keep the description under 5,000 characters.",
    ),
  consent: z.literal(true, { error: "Please confirm you've read the privacy policy." }),
  /** Honeypot: must stay empty. Hidden from people, visible to naive bots. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Milliseconds since epoch when the form was rendered (bot timing check). */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.input<typeof contactSchema>;

/** Responses from /api/contact.php (and the dev-server mock). */
export type ContactResponse =
  | { ok: true; delivered: true }
  | { ok: true; delivered: false; mode: "dry-run" }
  | {
      ok: false;
      error:
        "validation" | "rate_limited" | "not_configured" | "server" | "spam" | "method";
      fields?: Partial<Record<keyof ContactInput, string>>;
    };

export const CONTACT_ENDPOINT = "/api/contact.php";
