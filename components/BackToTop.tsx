import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type BackToTopProps = {
  offset?: number;
};

const BackToTop = ({ offset = 100 }: BackToTopProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > offset);

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasScrolled) return null;

  return <Button className="fixed bottom-3 right-3"></Button>;
};

export default BackToTop;
