import { Button } from "@/components/ui/button";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="dark bg-background flex py-4 px-4 md:px-8 lg:px-15 xl:px-[9.4rem] z-14">
      <Button asChild variant="link" className="px-2 md:px-2">
        <Link href="/" className="text-sm">
          Western Rank
        </Link>
      </Button>
      <Button asChild variant="link" className="px-2 md:px-2">
        <Link href="/about" className="text-sm">
          About
        </Link>
      </Button>
      <Button asChild variant="link" className="px-2 md:px-2">
        <Link href="/privacy-policy" className="text-sm">
          Privacy Policy
        </Link>
      </Button>
    </footer>
  );
};

export default Footer;
