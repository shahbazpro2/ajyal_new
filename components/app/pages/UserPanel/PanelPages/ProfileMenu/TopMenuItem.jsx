import React from "react";
import NextLink from "next/link";
import { Link as ReactRouterLink } from "react-router-dom";

const TopMenuItem = ({ link, icon, text, href, isReactRouter }) => {
  const Link = isReactRouter ? ReactRouterLink : NextLink;
  return (
    <div className="mobile-profile__top-item d-flex justify-content-center flex-column align-items-center">
      <Link href={href} as={link} to={link}>
        {isReactRouter ? (
          <>
            <i>{icon}</i>
            <p className="mt-3">{text}</p>
          </>
        ) : (
          <a>
            <i>{icon}</i>
            <p className="mt-3">{text}</p>
          </a>
        )}
      </Link>
    </div>
  );
};

export default TopMenuItem;
