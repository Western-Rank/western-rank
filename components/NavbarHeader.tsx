import Navbar, { type NavbarProps } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type NavbarHeaderProps = NavbarProps & {
  sticky?: boolean;
  heading: string;
  subHeading: string;
  Icon?: LucideIcon;
};

const NavbarHeader = ({ heading, subHeading, Icon, sticky, ...navbarProps }: NavbarHeaderProps) => {
  const { ref: fromBottomRef, inView: fromBottomInView } = useInView({
    rootMargin: "-140px 0px",
  });

  const { ref: fromTopRef, inView: fromTopInView } = useInView({
    rootMargin: "0px 0px",
  });

  const [headerSticky, setHeaderSticky] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!sticky || Date.now() - lastUpdateTime <= 100) {
      return;
    }
    if (headerSticky && fromTopInView) {
      setHeaderSticky(false);
      setLastUpdateTime(Date.now());
    } else if (hasScrolled && !headerSticky && !fromBottomInView) {
      setHeaderSticky(true);
      setLastUpdateTime(Date.now());
    }
  }, [sticky, fromTopInView, fromBottomInView, lastUpdateTime, headerSticky, hasScrolled]);

  return (
    <>
      <span ref={fromTopRef}></span>
      <div
        className={cn(
          "z-10 bg-background shadow-2xl border-b-0 shadow-background/30",
          headerSticky ? "sticky top-0" : "",
        )}
      >
        <Navbar {...navbarProps} sticky key="nav" />
        <motion.div
          animate={{
            paddingTop: headerSticky ? "0px" : "4rem",
          }}
          key="header"
          className={cn("duration-75 px-4 md:px-8 lg:px-15 xl:px-40 pb-1 z-8 bg-background")}
        >
          {!headerSticky && !!Icon && <Icon className="stroke-purple-500" width={36} height={36} />}
          <h4
            className={cn(
              "duration-100 transition-[font-size] text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 to-[25rem] py-1 max-w-screen whitespace-nowrap overflow-ellipsis overflow-hidden",
              headerSticky ? "text-sm pb-0" : "",
            )}
          >
            {headerSticky && !!Icon && (
              <Icon className="transition-opacity fade-in duration-1000 animate-in animate-out stroke-purple-500 inline-block h-4 mb-1" />
            )}
            {heading}{" "}
            {headerSticky && (
              <span className="animate-in animate-out transition-none text-sm text-primary">
                · {subHeading}
              </span>
            )}
          </h4>
          {!headerSticky && (
            <motion.h5 layout className="text-lg text-primary pb-3">
              {subHeading}
            </motion.h5>
          )}
        </motion.div>
      </div>
      <span ref={fromBottomRef}></span>
    </>
  );
};

export default NavbarHeader;
