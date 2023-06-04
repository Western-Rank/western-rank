import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Searchbar from "./Searchbar";
import Link from "next/link";
import { Button } from "./ui/button";

type NavbarProps = {
  searchBar?: boolean;
};

const Navbar = ({ searchBar }: NavbarProps) => {
  const { data: auth } = useSession();

  return (
    <nav className="flex items-center justify-between w-screen px-4 md:px-10 lg:px-20 xl:px-60">
      <Link href="/" className="p-2 flex flex-col items-center">
        <Image src="/logo.svg" alt="logo" width={42} height={30} />
        <span className="text-primary font-extrabold text-sm">Rank</span>
      </Link>
      <div>
        {auth?.user ? (
          <>
            <Button asChild variant="link">
              <Link href="/profile">Profile</Link>
            </Button>
            <Button asChild variant="link">
              {/* TODO change to onclick with signout() */}
              <Link href="/api/auth/signout">Log out</Link>
            </Button>
          </>
        ) : (
          <Button asChild variant="link">
            <Link href="/api/auth/signin">Log in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
