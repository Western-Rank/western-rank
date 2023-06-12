"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn, generateSliderTicks } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const ticks = generateSliderTicks(props.min ?? 0, props.max ?? 0, props.step);

  return (
    <div className="flex flex-col">
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      <div className="px-[5px] flex flex-grow w-full justify-between">
        {ticks.map((tick, index) => (
          <div className="flex flex-col items-center gap-0 space-y-0" key={index}>
            <span>•</span>
            {index % 2 == 0 && (
              <span className="text-[11px] text-secondary-foreground w-2.5 text-center overflow-visible whitespace-nowrap">
                {tick.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
