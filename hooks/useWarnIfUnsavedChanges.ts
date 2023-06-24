import Router from "next/router";
import { useEffect } from "react";

const useWarnIfUnsavedChanges = (
  unsavedChanges: boolean,
  routeChangeCallback: () => boolean,
  onUnload: (e: BeforeUnloadEvent) => void,
) => {
  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = routeChangeCallback();
        if (!ok) {
          Router.events.emit("routeChangeError");
          throw "Abort route change. Please ignore this error.";
        }
      };
      Router.events.on("routeChangeStart", routeChangeStart);

      return () => {
        Router.events.off("routeChangeStart", routeChangeStart);
      };
    }
  }, [unsavedChanges, routeChangeCallback]);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      if (unsavedChanges) {
        onUnload(e);
      }
    });
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [unsavedChanges, onUnload]);
};

export default useWarnIfUnsavedChanges;
