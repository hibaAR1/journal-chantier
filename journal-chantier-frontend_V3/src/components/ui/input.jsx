import * as React from "react"

import { cn } from "@/lib/utils"
import {cva} from "class-variance-authority";

const inputVariants = cva(
    "flex w-full rounded-md bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0 outline-0",
    {
        variants: {
            variant: {
                default: "text-xs border border-primary-600 bg-white text-black focus-visible:border-primary-500 hover:border-primary-500 placeholder:text-black-500 placeholder:font-sm",
                black: "text-xs border border-black bg-white text-black hover:border-black placeholder:text-foreground placeholder:font-light",

            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const Input = React.forwardRef(({ variant= 'default', className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
          cn(inputVariants({variant, className})),
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
