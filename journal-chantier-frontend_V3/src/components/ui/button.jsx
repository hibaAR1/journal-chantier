import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva} from "class-variance-authority";

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                black: "bg-black text-white",
                blackOutline: "border border-black text-black hover:bg-black hover:text-white",
                primary: "bg-primary-600 text-white hover:bg-primary-600",
                primaryOutline: "border border-primary-600 bg-white text-primary-600 hover:bg-primary-600 hover:text-white",
                primaryControl: "border border-primary-600 bg-white w-[100%] justify-between hover:bg-transparent hover:text-black text-black text-sm px-3 font-normal",
                gold: "bg-gold-400 text-white hover:bg-gold-900",
                goldOutline: "border border-gold-400 bg-white text-gold-400 hover:bg-gold-400 hover:text-white",
                success: "bg-success-400 text-white hover:bg-success-900",
                successOutline: "border border-success-400 bg-white text-success-400 hover:bg-success-400 hover:text-white",
                danger: "bg-red-400 text-white hover:bg-red-900",
                dangerOutline: "border border-red-400 bg-white text-red-400 hover:bg-red-400 hover:text-white",
                info: "bg-blue-500 text-white hover:bg-red-700",
                infoOutline: "border border-blue-500 bg-white text-blue-500 hover:bg-blue-500 hover:text-white",
                warning: "bg-warning-400 text-white hover:bg-warning-600",
                warningOutline: "border border-warning-400 text-warning-400 hover:bg-warning-400 hover:text-white",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                ghost2: "hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        (<Comp
            className={cn(buttonVariants({variant, size, className}))}
            ref={ref}
            {...props} />)
    );
})
Button.displayName = "Button"

export {Button, buttonVariants}
