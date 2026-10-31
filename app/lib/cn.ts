/** Join class names, skipping falsy values. Small enough to avoid a dependency. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
