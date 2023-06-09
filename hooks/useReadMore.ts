import { useState } from "react";

interface ReadMoreHook {
  text: string;
  maxLength: number;
}

const useReadMore: (props: ReadMoreHook) => [string, boolean, () => void] = ({
  text,
  maxLength,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (text.length >= maxLength) {
      setIsExpanded(!isExpanded);
    }
  };

  const displayText = isExpanded ? text : text.slice(0, maxLength);

  return [displayText, isExpanded, toggleExpand];
};

export default useReadMore;
