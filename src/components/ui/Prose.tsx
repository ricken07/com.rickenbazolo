import type { HTMLAttributes } from "react";
import clsx from "clsx";

export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "prose max-w-none min-w-0 rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-[1.75rem] sm:border sm:border-border/70 sm:bg-card/85 sm:p-8 sm:shadow-xl sm:shadow-black/10 lg:p-10 dark:sm:shadow-black/30",
        className,
      )}
      {...props}
    />
  );
}
