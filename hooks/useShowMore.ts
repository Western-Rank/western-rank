import { useState } from "react";

interface ShowMoreHook {
  text: string;
  maxLength: number;
}

const useShowMore: (props: ShowMoreHook) => [string, boolean, () => void] | [string] = ({
  text,
  maxLength,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (text.length >= maxLength) {
      setIsExpanded(!isExpanded);
    }
  };

  const displayText =
    isExpanded || text.length < maxLength + 5 ? text : text.slice(0, maxLength) + "...";

  if (text.length <= maxLength + 5) return [displayText];

  return [displayText, isExpanded, toggleExpand];
};

export default useShowMore;
