import { Button } from "@/components/ui/button";
import { MailIcon } from "lucide-react";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="dark bg-background flex justify-between py-4 px-4 md:px-8 lg:px-15 xl:px-[9.4rem] z-14">
      <div>
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
        <Button variant="link" className="px-2 md:px-2" asChild>
          <Link href="/privacy-policy" className="text-sm">
            Privacy Policy
          </Link>
        </Button>
      </div>

      <div>
        <Button variant="link" className="px-2 md:px-2" asChild>
          <a href="mailto:westernrank@gmail.com">
            <MailIcon className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
