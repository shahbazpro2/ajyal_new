import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isServer } from "../../../lib/isServer";

export function ScrollToTopReactRouter() {
  const { pathname } = useLocation();

  useEffect(() => {
    !isServer() && window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
