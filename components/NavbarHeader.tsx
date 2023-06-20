import Navbar, { type NavbarProps } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type NavbarHeaderProps = NavbarProps & {
  sticky?: boolean;
  heading: string;
  subHeading: string;
  Logo?: LucideIcon;
};

const NavbarHeader = ({ heading, subHeading, Logo, sticky, ...navbarProps }: NavbarHeaderProps) => {
  const { ref: fromBottomRef, inView: fromBottomInView } = useInView({
    rootMargin: "-170px 0px",
    onChange(inView, entry) {
      console.log("FROM BOTTOM inView:", inView, "entry:", entry);
    },
  });

  const { ref: fromTopRef, inView: fromTopInView } = useInView({
    rootMargin: "4px 0px",
    onChange(inView, entry) {
      console.log("FROM TOP inView:", inView, "entry:", entry);
    },
  });

  const [headerSticky, setHeaderSticky] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  const navbarSticky = !headerSticky && fromBottomInView;

  useEffect(() => {
    if (Date.now() - lastUpdateTime <= 100) {
      return;
    }
    if (headerSticky && fromTopInView) {
      setHeaderSticky(false);
      setLastUpdateTime(Date.now());
    } else if (!!sticky && !fromBottomInView) {
      setHeaderSticky(true);
      setLastUpdateTime(Date.now());
    }
  }, [sticky, fromTopInView, fromBottomInView, lastUpdateTime, headerSticky]);

  return (
    <>
      <span ref={fromTopRef}></span>
      <div className={cn("z-10 bg-background", headerSticky ? "sticky top-0" : "")}>
        <Navbar {...navbarProps} sticky={navbarSticky} key="nav" />
        <div
          key="pad"
          className={cn("pt-16", headerSticky ? "p-0" : "transition-[padding] duration-[25ms]")}
        ></div>
        <div
          key="header"
          className={cn(
            "px-4 md:px-8 lg:px-15 xl:px-40 pb-4 z-8 bg-transparent",
            headerSticky ? "pb-2" : "",
          )}
        >
          {!headerSticky && !!Logo && (
            <Logo className="animate-in animate-out stroke-purple-500" width={36} height={36} />
          )}
          <h4
            className={cn(
              "duration-[10ms] transition-[padding,_font-size] text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 to-[25rem] py-1",
              headerSticky ? "text-sm pb-0" : "",
            )}
          >
            {headerSticky && !!Logo && (
              <Logo className="animate-in animate-out stroke-purple-500 inline-block h-4 mb-1" />
            )}
            {heading}{" "}
            {headerSticky && (
              <span className="duration-[10ms] animate-in animate-out transition-none text-primary">
                | {subHeading}
              </span>
            )}
          </h4>
          <h5 className={cn("text-lg text-primary", headerSticky ? "hidden" : "")}>{subHeading}</h5>
        </div>
      </div>
      <span ref={fromBottomRef}></span>
    </>
  );
};

export default NavbarHeader;
