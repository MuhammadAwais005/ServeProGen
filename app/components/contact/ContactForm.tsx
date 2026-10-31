import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { ArrowRight, Button } from "~/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "~/components/ui/Field";
import { contactServiceOptions } from "~/content/services";
import { budgetRanges } from "~/content/site";
import {
  CONTACT_ENDPOINT,
  contactSchema,
  type ContactInput,
  type ContactResponse,
} from "~/lib/contact";
import { ease } from "~/lib/motion";

/** Current time for the bot-timing check (kept outside render). */
const timestamp = () => Date.now();

type Status =
  | { kind: "idle" }
  | { kind: "sent" }
  | { kind: "dry-run" }
  | { kind: "error"; message: string };

const errorMessages: Record<string, string> = {
  rate_limited:
    "Too many messages were sent from this connection. Please try again in an hour.",
  not_configured:
    "Our contact form isn't accepting messages yet. Please try again soon; we're finishing its setup.",
  spam: "Your message couldn't be accepted. Please try again.",
  server:
    "Something went wrong on our side and your message was not sent. Please try again.",
  method: "Your message could not be sent. Please refresh the page and try again.",
  validation: "Please check the highlighted fields.",
  network:
    "We couldn't reach the server, so your message was not sent. Check your connection and try again.",
};

/**
 * Project inquiry form. React Hook Form + Zod in the browser; the server
 * validates again. A success message appears only when the server confirms
 * delivery. Dry-run (local/staging) says plainly that nothing was sent.
 */
export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const statusRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      budget: "",
      message: "",
      website: "",
      startedAt: 0,
    },
  });

  // The timing check starts when the form is actually shown in the browser.
  useEffect(() => {
    setValue("startedAt", timestamp());
  }, [setValue]);

  // Preselect a service from ?service=<slug> after hydration (pages are static).
  useEffect(() => {
    if (
      defaultService &&
      (contactServiceOptions as readonly string[]).includes(defaultService)
    ) {
      setValue("service", defaultService as ContactInput["service"]);
    }
  }, [defaultService, setValue]);

  useEffect(() => {
    if (status.kind !== "idle") statusRef.current?.focus();
  }, [status]);

  const onSubmit = async (values: ContactInput) => {
    setStatus({ kind: "idle" });
    let result: ContactResponse;
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      result = (await response.json()) as ContactResponse;
    } catch {
      setStatus({ kind: "error", message: errorMessages.network! });
      return;
    }

    if (result.ok && result.delivered) {
      setStatus({ kind: "sent" });
      reset();
      setValue("startedAt", timestamp());
      return;
    }
    if (result.ok && !result.delivered) {
      setStatus({ kind: "dry-run" });
      return;
    }
    if (!result.ok && result.error === "validation" && result.fields) {
      for (const [field, message] of Object.entries(result.fields)) {
        if (message) setError(field as keyof ContactInput, { message });
      }
    }
    setStatus({
      kind: "error",
      message: (!result.ok && errorMessages[result.error]) || errorMessages.server!,
    });
  };

  if (status.kind === "sent") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-5 rounded-panel border border-success/40 bg-success/5 p-8 outline-none"
      >
        <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        <h2 className="text-h3">Thank you. Your message has been sent.</h2>
        <p className="text-muted">
          We read every inquiry personally and will reply to the email address you
          provided.
        </p>
        <Button variant="secondary" onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6"
      aria-describedby="form-note"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Full name"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Business email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <TextField
        label="Company name"
        hint="Optional"
        autoComplete="organization"
        error={errors.company?.message}
        {...register("company")}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          label="Service required"
          required
          error={errors.service?.message}
          defaultValue=""
          {...register("service")}
        >
          <option value="" disabled>
            Choose a service
          </option>
          {contactServiceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Estimated budget"
          hint="Optional"
          error={errors.budget?.message}
          {...register("budget")}
        >
          <option value="">Prefer not to say</option>
          {budgetRanges.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </SelectField>
      </div>
      <TextAreaField
        label="Project description"
        hint="What are you building or trying to improve, and what would success look like?"
        rows={6}
        required
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-small text-muted">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#FF702E]"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            {...register("consent")}
          />
          <span>
            I agree that ServeProGen may use these details to respond to my inquiry, as
            described in the{" "}
            <Link
              to="/privacy"
              className="text-accent-soft underline underline-offset-2 hover:text-text"
            >
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="text-small text-danger">
            {errors.consent.message}
          </p>
        )}
      </div>

      <AnimatePresence>
        {(status.kind === "error" || status.kind === "dry-run") && (
          <m.div
            ref={statusRef}
            tabIndex={-1}
            role={status.kind === "error" ? "alert" : "status"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.outExpo }}
            className={
              status.kind === "error"
                ? "flex gap-3 rounded-card border border-danger/50 bg-danger/5 p-4 text-small text-text outline-none"
                : "flex gap-3 rounded-card border border-accent/50 bg-accent/5 p-4 text-small text-text outline-none"
            }
          >
            {status.kind === "error" ? (
              <>
                <AlertTriangle
                  aria-hidden="true"
                  className="size-5 shrink-0 text-danger"
                />
                <p>{status.message}</p>
              </>
            ) : (
              <>
                <Info aria-hidden="true" className="size-5 shrink-0 text-accent" />
                <p>
                  <strong className="font-medium">
                    Test mode: your message was not sent.
                  </strong>{" "}
                  The form checked your details successfully, but email delivery is not
                  switched on for this version of the site.
                </p>
              </>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="text-small text-muted">
          Fields marked * are required.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send inquiry
              <ArrowRight />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
