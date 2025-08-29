import clsx from "clsx";
import React from "react";

type BoundedProps<T extends React.ElementType = "section"> = {
  as?: T;
  className?: string;
  children: React.ReactNode; // This can be any renderable content
} & React.ComponentProps<T>; // Directly use ComponentProps<T> to avoid omitting refs

export const Bounded = <T extends React.ElementType = "section">({
  as: Comp = "section" as T,
  className,
  children,
  ...restProps
}: BoundedProps<T>) => {
  return (
    <Comp
      className={clsx("px-4 first:pt-10 md:px-6", className)}
      {...restProps}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {children}
      </div>
    </Comp>
  );
};
