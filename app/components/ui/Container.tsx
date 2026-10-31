import type { ElementType, ReactNode } from "react";
import { cn } from "~/lib/cn";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Centered content column: 1280px max, 16 / 24 / 32px side gutters. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
