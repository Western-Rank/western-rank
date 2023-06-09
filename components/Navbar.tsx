import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Searchbar, { SearchbarDialog } from "./Searchbar";
import Link from "next/link";
import { Button } from "./ui/button";

type NavbarProps = {
  searchBar?: boolean;
};

const Navbar = ({ searchBar }: NavbarProps) => {
  const { data: auth } = useSession();

  return (
    <nav className="flex items-center justify-between px-4 md:px-8 lg:px-15 xl:px-40">
      <Link href="/" className="p-2 flex flex-col items-center">
        <Image src="/logo.svg" alt="logo" width={42} height={30} />
        <span className="text-primary font-extrabold text-sm">Rank</span>
      </Link>
      <div className="flex">
        {searchBar ? <SearchbarDialog /> : ""}
        {auth?.user ? (
          <>
            <Button asChild variant="link" className="px-1 md:px-2">
              <Link href="/profile" className="text-sm">
                Profile
              </Link>
            </Button>
            <Button asChild variant="link" className="px-1 md:px-2s">
              {/* TODO change to onclick with signout() */}
              <Link href="/api/auth/signout" className="text-sm">
                Log out
              </Link>
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
