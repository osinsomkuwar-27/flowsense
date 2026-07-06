import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-solid bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[#ffffff] bg-[#ffffff] text-[#0F172A] hover:bg-[#111013] hover:text-[#ffffff] hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:border-[#ffffff]/90",
        secondary:
          "border-[#64748B] bg-[#FAF8F9] text-[#334155] hover:bg-[#0f0e11] hover:text-[#64748B] hover:shadow-[0_0_15px_rgba(154,140,152,0.25)] hover:border-[#64748B]/90",
        outline:
          "border-[#334155] bg-[#ECEFF6] text-[#0F172A] hover:bg-[#0e0e13] hover:text-[#334155] hover:shadow-[0_0_15px_rgba(74,78,105,0.25)] hover:border-[#334155]/90",
        ghost:
          "border-transparent bg-transparent text-[#64748B] hover:bg-[#17151a] hover:text-white",
        link:
          "border-transparent bg-transparent text-[#ffffff] underline-offset-4 hover:underline",
        destructive:
          "border-[#ef4444] bg-[#FEF2F2] text-[#991B1B] hover:bg-[#170a0a] hover:text-[#ef4444] hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] hover:border-red-400",
      },
      size: {
        default: "h-9.5 px-5 py-2 gap-2 has-[>svg]:px-4",
        sm: "h-8.5 gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-11 px-7 gap-2 has-[>svg]:px-5 text-[15px]",
        icon: "size-9.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
