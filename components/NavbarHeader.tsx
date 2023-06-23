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
      if (!hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasScrolled]);

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
          "z-30 bg-background",
          headerSticky ? "sticky top-0 shadow-2xl border-b-0 shadow-background/30" : "",
        )}
      >
        <Navbar {...navbarProps} sticky key="nav" />
        <motion.div
          initial={false}
          animate={{
            paddingTop: headerSticky ? "0px" : "4rem",
            paddingBottom: headerSticky ? "0px" : "0.75rem",
            flexDirection: headerSticky ? "row" : "column",
            alignItems: headerSticky ? "center" : "",
          }}
          key="header"
          className="flex flex-col px-4 md:px-8 lg:px-15 xl:px-40 pb-1 z-8 bg-background max-w-screen 0.75rem"
        >
          {!headerSticky && !!Icon && <Icon className="stroke-purple-500" width={36} height={36} />}
          <motion.h4
            initial={false}
            animate={{
              fontSize: headerSticky ? "0.875rem" : "1.875rem",
            }}
            className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 to-[25rem] whitespace-nowrap py-1"
          >
            {headerSticky && !!Icon && <Icon className="stroke-purple-500 inline-block h-4 mb-1" />}
            {heading}
          </motion.h4>
          <motion.h5
            initial={false}
            animate={{
              fontSize: headerSticky ? "0.8rem" : "1.1rem",
              paddingLeft: headerSticky ? "0.2rem" : "0px",
              whiteSpace: headerSticky ? "nowrap" : "normal",
            }}
            className="text-sm text-primary py-1 overflow-hidden text-ellipsis"
          >
            {headerSticky && " · "}
            {subHeading}
          </motion.h5>
        </motion.div>
      </div>
      <span ref={fromBottomRef}></span>
    </>
  );
};

export default NavbarHeader;
