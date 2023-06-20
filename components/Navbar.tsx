import { SearchbarDialog } from "@/components/Searchbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

export type NavbarProps = {
  sticky?: boolean;
  searchBar?: boolean;
  className?: string;
};

const Navbar = ({ sticky, searchBar, className }: NavbarProps) => {
  const { data: auth } = useSession();

  return (
    <nav
      className={cn(
        "dark bg-background flex items-center justify-between px-4 md:px-8 lg:px-15 xl:px-[9.4rem] z-14",
        sticky ? "sticky top-0" : "",
        className,
      )}
    >
      <Link href="/" className="p-2 flex flex-col items-center">
        <Image src="/logo.svg" alt="logo" width={42} height={30} />
        <span className="text-primary font-extrabold text-sm">Rank</span>
      </Link>
      <div className="flex items-center">
        {searchBar ? <SearchbarDialog /> : ""}
        {auth?.user ? (
          <>
            <Button asChild variant="link" className="px-1 md:px-2">
              <Link href="/profile" className="text-sm">
                Profile
              </Link>
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="link"
              className="px-1 md:px-2 text-sm"
            >
              Log out
            </Button>
          </>
        ) : (
          <Button asChild variant="link" className="px-1">
            <Link href="/api/auth/signin" className="text-sm">
              Log in
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
