import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    weight: {
      thin: "font-thin",
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    weight: "regular",
  },
});

type SharedProps = VariantProps<typeof typographyVariants> & {
  asChild?: boolean;
};

export function TypographyH1({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"h1"> & SharedProps) {
  const Comp = asChild ? Slot : "h1";
  return (
    <Comp
      className={cn(
        "text-[40px] leading-[120%] tracking-[-0.01rem] lg:text-5xl",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function TypographyH2({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & SharedProps) {
  const Comp = asChild ? Slot : "h2";
  return (
    <Comp
      className={cn(
        "text-[28px] leading-[120%] tracking-[-0.01rem] lg:text-[40px]",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
export function TypographyH3({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"h3"> & SharedProps) {
  const Comp = asChild ? Slot : "h3";
  return (
    <Comp
      className={cn(
        "text-2xl leading-[120%] tracking-[-0.01rem] lg:text-[32px]",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
export function TypographyH4({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"h4"> & SharedProps) {
  const Comp = asChild ? Slot : "h4";
  return (
    <Comp
      className={cn(
        "text-xl leading-[120%] tracking-[-0.01rem] lg:text-2xl",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
export function TypographyH5({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"h5"> & SharedProps) {
  const Comp = asChild ? Slot : "h5";
  return (
    <Comp
      className={cn(
        "text-lg leading-[150%] tracking-[-0.01rem] lg:text-xl",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
export function TypographyBody({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & SharedProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "text-sm sm:text-base leading-[130%] tracking-[-0.01rem]",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function TypographyCaption({
  className,
  weight,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & SharedProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "text-xs leading-[130%] tracking-[0.005rem]",
        typographyVariants({ weight, className })
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
