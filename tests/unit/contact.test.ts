import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contactServiceOptions } from "../../app/content/services";
import { budgetRanges } from "../../app/content/site";
import { CONTACT_LIMITS, contactSchema } from "../../app/lib/contact";

const valid = {
  name: "Ada Tester",
  email: "ada@example.com",
  company: "",
  service: "AI & Machine Learning",
  budget: "",
  message: "We would like a computer vision prototype for counting items.",
  consent: true,
  website: "",
  startedAt: 1_700_000_000_000,
};

describe("contact form schema", () => {
  it("accepts a valid inquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["name too short", { name: "A" }],
    ["invalid email", { email: "not-an-email" }],
    ["unknown service", { service: "Hacking" }],
    ["message too short", { message: "Too short" }],
    ["no consent", { consent: false }],
    ["honeypot filled", { website: "http://spam.example" }],
    ["unknown budget", { budget: "A million" }],
  ])("rejects %s", (_label, patch) => {
    expect(contactSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
  });
});

/**
 * The PHP endpoint validates independently. These checks fail if its option
 * lists or limits drift from the TypeScript ones.
 */
describe("PHP endpoint stays in sync", () => {
  const php = readFileSync("public/api/contact.php", "utf8");

  const phpArray = (name: string) => {
    const block = php.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`))?.[1] ?? "";
    return [...block.matchAll(/'([^']*)'/g)].map((m) => m[1]);
  };

  it("service options match", () => {
    expect(phpArray("SERVICES")).toEqual([...contactServiceOptions]);
  });

  it("budget ranges match", () => {
    expect(phpArray("BUDGETS")).toEqual([...budgetRanges]);
  });

  it("length limits match", () => {
    const limit = (key: string) =>
      Number(php.match(new RegExp(`'${key}' => (\\d+)`))?.[1]);
    expect(limit("name_min")).toBe(CONTACT_LIMITS.name.min);
    expect(limit("name_max")).toBe(CONTACT_LIMITS.name.max);
    expect(limit("email_max")).toBe(CONTACT_LIMITS.email.max);
    expect(limit("company_max")).toBe(CONTACT_LIMITS.company.max);
    expect(limit("message_min")).toBe(CONTACT_LIMITS.message.min);
    expect(limit("message_max")).toBe(CONTACT_LIMITS.message.max);
  });
});
