export const useScroll = () => {
  if (typeof window === "undefined") return {hasScrolled: () => false, backToTop: () => {}}


  const backToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const hasScrolled = () => window.scrollY > window.outerHeight;

  return { hasScrolled, backToTop };
};
