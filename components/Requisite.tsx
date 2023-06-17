import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { requisiteDescription, requisiteTypes } from "@/lib/courses";
import { Info } from "lucide-react";
import Link from "next/link";

export type RequisiteTextItem = {
  text: string;
  isLink: boolean;
};

type RequisiteProps = {
  type: (typeof requisiteTypes)[number];
  requisiteText: RequisiteTextItem[];
};

const Requisite = ({ type, requisiteText }: RequisiteProps) => {
  return (
    <div>
      <div className="flex">
        <h5 className="text-lg font-semibold">{type}</h5>
        <Popover>
          <PopoverTrigger className="text-xs text-muted-foreground font-bold px-1.5">
            <Info width="18" />
          </PopoverTrigger>
          <PopoverContent side="top" className="w-[250px] text-sm">
            {requisiteDescription[type]}
          </PopoverContent>
        </Popover>
      </div>
      <p className="whitespace-pre-wrap">
        {requisiteText.map((item, index) => {
          if (item.isLink) {
            const course_code = item?.text;
            return (
              <Button key={index} variant="link" className="p-0 h-3 pr-1 text-blue-500" asChild>
                <Link href={`/course/${encodeURIComponent(course_code)}`}>{item.text}</Link>
              </Button>
            );
          } else {
            return <span key={index}>{item.text + " "}</span>;
          }
        })}
      </p>
    </div>
  );
};

export default Requisite;
