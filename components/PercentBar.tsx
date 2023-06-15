import { ReactNode } from "react";
import { Progress } from "./ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type PercentBarProps = {
  percent: number;
  children: ReactNode;
};

const PercentBar = ({ percent, children }: PercentBarProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div>
            <Progress value={percent} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PercentBar;
