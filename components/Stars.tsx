import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type StarsProps = {
  value: number;
  size: number;
  theme: "purple" | "blue";
};

const activatedFill = {
  purple: "fill-purple-600",
  blue: "fill-blue-400",
};

const deactivatedFill = {
  purple: "fill-purple-200",
  blue: "fill-blue-100",
};

const Stars = ({ value, size, theme }: StarsProps) => {
  const quotient = Math.floor(value);
  const remainder = value - quotient;
  const rest = 5 - Math.ceil(value);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div className="flex">
            {[...Array(quotient)].map((i) => (
              <Star size={size} color="" key={i} className={cn("px-0", activatedFill[theme])} />
            ))}
            {remainder > 0 && (
              <>
                <Star
                  size={size}
                  style={{ width: remainder * size }}
                  preserveAspectRatio="xMinYMin slice"
                  color=""
                  className={cn("px-0", activatedFill[theme])}
                />
                <Star
                  size={size}
                  style={{ width: remainder * size }}
                  color=""
                  preserveAspectRatio="xMaxYMax slice"
                  className={cn("px-0", deactivatedFill[theme])}
                />
              </>
            )}
            {[...Array(rest)].map((i) => (
              <Star size={size} color="" key={i} className={deactivatedFill[theme]} />
            ))}
            <p className="sr-only">{value} of 5 Stars</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{value} of 5 Stars</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Stars;
