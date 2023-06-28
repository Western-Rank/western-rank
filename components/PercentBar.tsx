import { Progress } from "@/components/ui/progress";
import { ReactNode } from "react";
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
          <Progress value={percent} />
        </TooltipTrigger>
        <TooltipContent side="left">{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PercentBar;
