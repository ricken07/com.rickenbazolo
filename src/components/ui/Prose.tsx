import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "prose max-w-none rounded-[1.75rem] border border-border/70 bg-card/85 p-5 shadow-xl shadow-black/10 sm:p-8 lg:p-10 dark:shadow-black/30",
        className,
      )}
      {...props}
    />
  );
}
